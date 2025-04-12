"use client"

import { useState } from "react"
import { SetupQuestionnaireTables } from "@/components/setup-questionnaire-tables"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    sql?: string
    errors?: string[]
  } | null>(null)

  const runMigration = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup-client-fields")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Setup</h1>

      <div className="space-y-8">
        <SetupQuestionnaireTables />

        {/* Other setup components */}
      </div>
    </div>
  )
}
