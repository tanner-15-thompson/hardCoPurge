"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function SeedClientsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const seedClients = async () => {
    try {
      setLoading(true)
      setResult(null)

      const response = await fetch("/api/seed-clients")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to seed clients")
      }

      setResult({
        success: true,
        message: data.message || "Clients seeded successfully",
      })
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 border border-gray-700 rounded-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Seed Test Clients</h1>

      <p className="text-gray-300 mb-6">
        This will create a test client with ID 1 in your database. This is useful for testing the admin client detail
        page.
      </p>

      <Button onClick={seedClients} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Seeding Clients...
          </>
        ) : (
          "Seed Test Clients"
        )}
      </Button>

      {result && (
        <div
          className={`mt-4 p-4 rounded-md ${result.success ? "bg-green-900/20 border border-green-800" : "bg-red-900/20 border border-red-800"}`}
        >
          {result.success ? (
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-green-400">Success</p>
                <p className="text-gray-300">{result.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-red-400">Error</p>
                <p className="text-gray-300">{result.error}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400">
        <p>After seeding, you can visit:</p>
        <a href="/admin/clients/1" className="text-purple-400 hover:underline mt-2 block">
          /admin/clients/1
        </a>
      </div>
    </div>
  )
}
