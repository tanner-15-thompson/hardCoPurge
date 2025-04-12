import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Users, FileText, ArrowRight } from "lucide-react"

export default async function PromptGeneratorPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch clients with questionnaires
  const { data: clientsWithQuestionnaires } = await supabase
    .from("client_questionnaires")
    .select("client_id")
    .order("updated_at", { ascending: false })

  // Get unique client IDs
  const uniqueClientIds = Array.from(new Set(clientsWithQuestionnaires?.map((q) => q.client_id) || []))

  // Fetch client details
  let clients = []
  if (uniqueClientIds.length > 0) {
    const { data: clientsData } = await supabase.from("clients").select("id, name, email").in("id", uniqueClientIds)

    clients = clientsData || []
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Plan Generator</h1>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 mb-8">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-purple-400 mr-3" />
          <h2 className="text-xl font-semibold text-white">Generate Workout & Nutrition Plans</h2>
        </div>

        <p className="text-gray-300 mb-6">
          Select a client below to generate workout and nutrition plan prompts based on their questionnaire responses.
          You can then use these prompts with Grok to create personalized plans.
        </p>

        {clients.length > 0 ? (
          <div className="space-y-4">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/admin/clients/${client.id}/prompt-generator`}
                className="flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div>
                  <h3 className="font-medium text-white">{client.name}</h3>
                  <p className="text-gray-300 text-sm">{client.email}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-700 rounded-lg">
            <Users className="h-12 w-12 mx-auto text-gray-500 mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">No Clients with Questionnaires</h3>
            <p className="text-gray-400 mb-4">
              Complete questionnaires for clients to generate workout and nutrition plans.
            </p>
            <Link
              href="/admin/clients"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              Manage Clients
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
