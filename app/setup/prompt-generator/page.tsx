"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function SetupPromptGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const setupPromptGenerator = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup-prompt-generator")
      const data = await response.json()

      setResult(data)
    } catch (error) {
      setResult({ error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Setup Prompt Generator</h1>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Prompt Generator Setup</h2>
        <p className="mb-4 text-gray-400">
          This will create the necessary database tables for the prompt generator feature. This includes the
          generated_prompts table and related permissions.
        </p>

        <Button onClick={setupPromptGenerator} disabled={isLoading} className="bg-purple-600 hover:bg-purple-500">
          {isLoading ? "Setting up..." : "Run Setup"}
        </Button>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg ${result.success ? "bg-green-900/20 border border-green-800 text-green-400" : "bg-red-900/20 border border-red-800 text-red-400"}`}
          >
            {result.success ? <p>{result.message}</p> : <p>{result.error}</p>}
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">What This Sets Up</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>
            Creates the <code className="bg-gray-700 px-1 py-0.5 rounded">generated_prompts</code> table
          </li>
          <li>Sets up appropriate indexes for performance</li>
          <li>Configures Row Level Security policies</li>
          <li>Enables tracking of prompt usage</li>
        </ul>
      </div>
    </div>
  )
}
