"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check, Database, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SetupPlanHistory() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sqlInstructions, setSqlInstructions] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const setupTables = async () => {
    setLoading(true)
    setError(null)
    setSqlInstructions(null)

    try {
      const response = await fetch("/api/setup-plan-history")
      const data = await response.json()

      if (data.sql) {
        // We got SQL instructions to run manually
        setSqlInstructions(data.sql)
        setSuccess(false)
      } else if (!response.ok) {
        throw new Error(data.error || "Failed to set up plan history tables")
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      console.error("Error setting up plan history tables:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (sqlInstructions) {
      navigator.clipboard.writeText(sqlInstructions)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Database className="h-5 w-5 mr-2 text-gray-500" />
          Database Setup
        </CardTitle>
        <CardDescription>
          Set up the database tables required for tracking workout and nutrition plan history
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {sqlInstructions ? (
          <div className="space-y-4">
            <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please run the following SQL in your Supabase SQL Editor to create the necessary tables:
              </AlertDescription>
            </Alert>

            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">{sqlInstructions}</pre>
              <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              After running the SQL, refresh this page to continue using the plan history features.
            </p>
          </div>
        ) : success ? (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertDescription>Plan history tables set up successfully!</AlertDescription>
          </Alert>
        ) : (
          <Button onClick={setupTables} disabled={loading} className="flex items-center gap-2">
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Setting up...
              </>
            ) : (
              <>Set Up Plan History Tables</>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
