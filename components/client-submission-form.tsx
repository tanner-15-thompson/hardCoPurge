"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ClientSubmissionForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    goals: "",
    referral_source: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Basic validation
    if (!formData.name || !formData.email) {
      setError("Name and email are required fields")
      return
    }

    setLoading(true)

    try {
      // Check if email already exists
      const { data: existingClient } = await supabase
        .from("clients")
        .select("id")
        .eq("email", formData.email)
        .maybeSingle()

      if (existingClient) {
        setError("A client with this email address already exists")
        setLoading(false)
        return
      }

      // Insert new client
      const { data, error } = await supabase.from("clients").insert([formData]).select()

      if (error) throw error

      setSuccess("Client created successfully!")
      setFormData({
        name: "",
        email: "",
        phone: "",
        goals: "",
        referral_source: "",
      })

      // Redirect to the new client's page after a short delay
      if (data && data[0]) {
        setTimeout(() => {
          router.push(`/admin/clients/${data[0].id}`)
        }, 1500)
      }
    } catch (err: any) {
      console.error("Error creating client:", err)
      setError(err.message || "An error occurred while creating the client")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/20 border-green-800 text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="goals">Fitness Goals</Label>
          <Textarea
            id="goals"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            placeholder="What are your fitness goals?"
            className="bg-gray-700 border-gray-600 text-white"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="referral_source">How did you hear about us?</Label>
          <Input
            id="referral_source"
            name="referral_source"
            value={formData.referral_source}
            onChange={handleChange}
            placeholder="Google, friend, social media, etc."
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Client"
        )}
      </Button>
    </form>
  )
}
