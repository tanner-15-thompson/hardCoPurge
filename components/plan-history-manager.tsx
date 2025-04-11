"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Clock, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import DOMPurify from "dompurify"
import Link from "next/link"

interface PlanHistoryManagerProps {
  clientId: number
  planType: "workout" | "nutrition"
}

export function PlanHistoryManager({ clientId, planType }: PlanHistoryManagerProps) {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null)
  const [tablesExist, setTablesExist] = useState(true)

  // Form state
  const [planName, setPlanName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const [planHtml, setPlanHtml] = useState("")
  const [htmlFile, setHtmlFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  const supabase = createClientComponentClient()

  const tableName = planType === "workout" ? "workout_plan_history" : "nutrition_plan_history"
  const planTypeLabel = planType === "workout" ? "Workout" : "Nutrition"

  useEffect(() => {
    fetchPlans()
  }, [clientId, planType])

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })

      if (error) {
        // Check if the error is about missing tables
        if (error.message.includes("does not exist")) {
          console.error(`Table ${tableName} does not exist yet. Please run the setup process.`)
          setPlans([])
          setTablesExist(false)
          setError("Database tables not set up yet. Please use the setup tool on the clients page.")
        } else {
          throw error
        }
      } else {
        setPlans(data || [])
        setTablesExist(true)
        setError("")
      }
    } catch (err: any) {
      console.error(`Error fetching ${planType} plans:`, err)
      setError(`Error: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]
    setHtmlFile(file)

    // Read the file content
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setPlanHtml(event.target.result as string)
      }
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!planName.trim()) {
      setError("Plan name is required")
      return
    }

    if (!planHtml.trim()) {
      setError("Plan content is required")
      return
    }

    try {
      const { error } = await supabase.from(tableName).insert({
        client_id: clientId,
        plan_name: planName,
        start_date: startDate || null,
        end_date: endDate || null,
        notes: notes,
        [`${planType}_html`]: planHtml,
      })

      if (error) throw error

      // Reset form
      setPlanName("")
      setStartDate("")
      setEndDate("")
      setNotes("")
      setPlanHtml("")
      setHtmlFile(null)
      setError("")

      // Close dialog and refresh plans
      setUploadDialogOpen(false)
      fetchPlans()
    } catch (err: any) {
      console.error(`Error saving ${planType} plan:`, err)
      setError(err.message || `Failed to save ${planType} plan`)
    }
  }

  const handleViewPlan = (plan: any) => {
    setSelectedPlan(plan)
    setViewDialogOpen(true)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString()
  }

  const toggleExpand = (planId: number) => {
    if (expandedPlanId === planId) {
      setExpandedPlanId(null)
    } else {
      setExpandedPlanId(planId)
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">{planTypeLabel} Plan History</h2>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2" disabled={!tablesExist}>
              <Upload className="h-4 w-4" />
              Upload Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload {planTypeLabel} Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label htmlFor="plan-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name *
                </label>
                <Input
                  id="plan-name"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder={`e.g., ${planTypeLabel} Plan - April 2025`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information about this plan"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="plan-file" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload HTML File *
                </label>
                <Input
                  id="plan-file"
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload the exported {planTypeLabel.toLowerCase()} plan HTML file
                </p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!planHtml || !planName}>
                  Save Plan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2 animate-spin" />
            <p className="text-gray-500">Loading plans...</p>
          </div>
        ) : !tablesExist ? (
          <div className="text-center py-8 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Database Setup Required</h3>
            <p className="text-yellow-700 mb-4">
              The database tables for plan history haven't been set up yet. Please go to the clients page and use the
              Database Setup tool.
            </p>
            <Link href="/clients">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Go to Setup</Button>
            </Link>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {planTypeLabel} Plans Yet</h3>
            <p className="text-gray-500 mb-4">
              Upload previous {planTypeLabel.toLowerCase()} plans to keep track of your client's history.
            </p>
            <Button onClick={() => setUploadDialogOpen(true)}>Upload First Plan</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {plans.map((plan) => (
                  <li key={plan.id} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="truncate text-sm font-medium text-blue-600">{plan.plan_name}</p>
                          <div className="ml-2 flex flex-shrink-0">
                            <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              {new Date(plan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewPlan(plan)} className="text-xs">
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(plan.id)}
                            className="p-1 h-8 w-8"
                          >
                            {expandedPlanId === plan.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </Button>
                        </div>
                      </div>

                      {expandedPlanId === plan.id && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Start Date</p>
                              <p className="font-medium">{formatDate(plan.start_date)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">End Date</p>
                              <p className="font-medium">{formatDate(plan.end_date)}</p>
                            </div>
                          </div>

                          {plan.notes && (
                            <div className="mt-4">
                              <p className="text-gray-500">Notes</p>
                              <p className="text-sm mt-1 bg-gray-50 p-2 rounded">{plan.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* View Plan Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.plan_name}</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {selectedPlan && new Date(selectedPlan.created_at).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Period:</span> {selectedPlan && formatDate(selectedPlan.start_date)} -{" "}
                {selectedPlan && formatDate(selectedPlan.end_date)}
              </div>
            </div>

            {selectedPlan?.notes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-sm text-gray-700">Notes:</p>
                <p className="text-gray-600">{selectedPlan.notes}</p>
              </div>
            )}

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium">{planTypeLabel} Plan Content</h3>
              </div>
              <div className="p-4 max-h-[50vh] overflow-y-auto">
                {selectedPlan && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(selectedPlan[`${planType}_html`]),
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
