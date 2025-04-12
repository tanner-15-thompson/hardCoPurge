import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ClientHeaderNav } from "@/components/client-header-nav"
import { AdminClientQuestionnaires } from "./admin-client-questionnaires"

export default async function AdminClientQuestionnairesPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const clientId = Number.parseInt(params.id)

  // Fetch client data
  const { data: client, error } = await supabase.from("clients").select("id, name, email").eq("id", clientId).single()

  if (error || !client) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error ? `Error loading client: ${error.message}` : "Client not found"}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <ClientHeaderNav clientId={clientId} clientName={client.name} />
      <AdminClientQuestionnaires clientId={clientId} clientName={client.name} />
    </div>
  )
}
