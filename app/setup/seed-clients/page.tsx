"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function SeedClientsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeedClients = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/seed-clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to seed clients")
      }

      setResult({
        success: true,
        message: data.message || "Test clients created successfully",
      })
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-white">Seed Test Clients</h1>

      <p className="text-gray-300 mb-6">
        This will create a test client with ID 1 in your database. This is useful for testing the admin client
        management features.
      </p>

      {result && (
        <Alert
          variant={result.success ? "default" : "destructive"}
          className={`mb-6 ${
            result.success
              ? "bg-green-900/20 border-green-800 text-green-400"
              : "bg-red-900/20 border-red-800 text-red-400"
          }`}
        >
          {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleSeedClients}
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Test Clients...
          </>
        ) : (
          "Seed Test Clients"
        )}
      </Button>
    </div>
  )
}
