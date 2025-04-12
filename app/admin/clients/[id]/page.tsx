"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"
import { ClientHeaderNav } from "@/components/client-header-nav"
import { ClientDetailContent } from "@/app/admin/clients/[id]/client-detail-content"

export default function ClientDetailPage() {
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const clientId = params?.id
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchClient() {
      if (!clientId) {
        setError("Client ID is missing")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data, error } = await supabase.from("clients").select("*").eq("id", clientId).single()

        if (error) {
          throw error
        }

        if (!data) {
          setError("Client not found")
        } else {
          setClient(data)
        }
      } catch (error: any) {
        console.error("Error fetching client:", error)
        setError(error.message || "Failed to load client")
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [clientId, supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
        <p className="text-gray-300">{error}</p>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-400">Client not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <ClientHeaderNav clientId={client.id} clientName={client.name} />
      <ClientDetailContent client={client} />
    </div>
  )
}
