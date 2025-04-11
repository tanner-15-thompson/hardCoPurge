import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import NutritionPromptGenerator from "./nutrition-prompt-generator"

export default async function GenerateNutritionPromptPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const clientId = Number.parseInt(params.id)

  try {
    // Fetch client data
    const { data: client, error } = await supabase
      .from("clients")
      .select("id, name, email, phone, goals, dietary_restrictions")
      .eq("id", clientId)
      .single()

    if (error) {
      console.error("Error fetching client:", error)
      return (
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl" role="alert">
            <p className="font-medium">Client not found</p>
            <p className="text-sm mt-1">
              The client you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </div>
        </div>
      )
    }

    // Fetch questionnaire data
    const { data: questionnaire, error: questionnaireError } = await supabase
      .from("client_questionnaires")
      .select("nutrition_data")
      .eq("client_id", clientId)
      .single()

    if (questionnaireError || !questionnaire?.nutrition_data) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href={`/admin/clients/${clientId}/details`}
              className="inline-flex items-center text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to client details
            </Link>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Generate Nutrition Prompt</h1>
            <div
              className="bg-yellow-900/20 border border-yellow-800 text-yellow-400 px-4 py-3 rounded-xl"
              role="alert"
            >
              <p className="font-medium">Nutrition questionnaire not completed</p>
              <p className="text-sm mt-2">
                This client hasn't completed the nutrition questionnaire yet. Please complete it first to generate a
                personalized nutrition prompt.
              </p>
              <div className="mt-4">
                <Link
                  href={`/admin/clients/${clientId}/questionnaire`}
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Complete Questionnaire
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/admin/clients/${clientId}/details`}
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to client details
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Generate Nutrition Prompt</h1>
          <p className="text-gray-400 mb-6">
            This prompt is generated based on {client.name}'s questionnaire data and can be used with AI tools to create
            personalized nutrition plans.
          </p>

          <NutritionPromptGenerator client={client} nutritionData={questionnaire.nutrition_data} />
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in generate nutrition prompt page:", err)
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl" role="alert">
          <p className="font-medium">An error occurred</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      </div>
    )
  }
}
