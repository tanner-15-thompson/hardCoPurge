"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminClientQuestionnairesProps {
  clientId: number
  clientName: string
}

export function AdminClientQuestionnaires({ clientId, clientName }: AdminClientQuestionnairesProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questionnaires, setQuestionnaires] = useState<any[]>([])
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from("client_questionnaires")
          .select("*")
          .eq("client_id", clientId)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setQuestionnaires(data || [])
      } catch (err: any) {
        console.error("Error fetching questionnaires:", err)
        setError(err.message || "Failed to load questionnaires")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionnaires()
  }, [clientId, supabase])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Questionnaires</h2>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="p-4 text-center text-gray-300">Loading questionnaires...</div>
      ) : questionnaires.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">No questionnaires found for this client.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questionnaires.map((questionnaire) => (
            <div key={questionnaire.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-white">{questionnaire.title}</h3>
              <p className="text-gray-400 text-sm">Created at: {new Date(questionnaire.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
