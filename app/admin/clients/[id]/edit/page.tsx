import { createServerSupabaseClient } from "@/lib/supabase"
import { ClientEditForm } from "./client-edit-form"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const clientId = params.id
  const supabase = createServerSupabaseClient()

  // Fetch client data
  const { data: client, error } = await supabase.from("clients").select("*").eq("id", clientId).single()

  if (error || !client) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading client: {error?.message || "Client not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Client</h1>
      <ClientEditForm client={client} />
    </div>
  )
}
