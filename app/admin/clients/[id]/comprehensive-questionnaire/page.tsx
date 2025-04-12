import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ComprehensiveQuestionnaire } from "@/components/comprehensive-questionnaire"

export default async function ComprehensiveQuestionnairePage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const clientId = Number.parseInt(params.id)

  if (isNaN(clientId)) {
    return <div className="p-4">Invalid client ID</div>
  }

  // Fetch client data
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, name")
    .eq("id", clientId)
    .single()

  if (clientError) {
    console.error("Error fetching client:", clientError)
    return <div className="p-4">Error loading client data</div>
  }

  // Fetch existing questionnaire data
  const { data: questionnaire, error: questionnaireError } = await supabase
    .from("client_questionnaires")
    .select("workout_data, nutrition_data")
    .eq("client_id", clientId)
    .maybeSingle()

  if (questionnaireError && !questionnaireError.message.includes("No rows found")) {
    console.error("Error fetching questionnaire:", questionnaireError)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href={`/admin/clients/${clientId}`}
          className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Client
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <ComprehensiveQuestionnaire
          clientId={clientId}
          clientName={client.name}
          initialWorkoutData={questionnaire?.workout_data}
          initialNutritionData={questionnaire?.nutrition_data}
        />
      </div>
    </div>
  )
}
