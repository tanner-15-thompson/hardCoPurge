"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SetupQuestionnaireTables() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setupTables = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/setup-questionnaire-tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to set up questionnaire tables")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error setting up questionnaire tables:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Set Up Questionnaire Tables</h3>
        <Button onClick={setupTables} disabled={loading || success}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting Up...
            </>
          ) : success ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Completed
            </>
          ) : (
            "Set Up Tables"
          )}
        </Button>
      </div>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Questionnaire tables have been set up successfully.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-500">
        <p>This will create the following tables if they don't exist:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>client_questionnaires - Stores questionnaire templates for each client</li>
          <li>client_questionnaire_responses - Stores client responses to questionnaires</li>
        </ul>
      </div>
    </div>
  )
}
