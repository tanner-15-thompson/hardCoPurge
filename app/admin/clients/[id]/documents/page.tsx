import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { ClientHeaderNav } from "@/components/client-header-nav"
import { ClientDocumentsClient } from "./client"

export default async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      return notFound()
    }

    // Fetch client data
    const { data: client, error } = await supabase
      .from("clients")
      .select("id, name, email, phone")
      .eq("id", clientId)
      .single()

    if (error || !client) {
      console.error("Error fetching client:", error)
      return notFound()
    }

    // Fetch workout plan history
    const { data: workoutHistory } = await supabase
      .from("plan_history")
      .select("*")
      .eq("client_id", clientId)
      .eq("plan_type", "workout")
      .order("created_at", { ascending: false })

    // Fetch nutrition plan history
    const { data: nutritionHistory } = await supabase
      .from("plan_history")
      .select("*")
      .eq("client_id", clientId)
      .eq("plan_type", "nutrition")
      .order("created_at", { ascending: false })

    // Fetch other documents
    const { data: documents } = await supabase
      .from("client_documents")
      .select("*")
      .eq("client_id", clientId)
      .order("uploaded_at", { ascending: false })

    return (
      <div>
        <ClientHeaderNav clientId={clientId} clientName={client.name} />
        <ClientDocumentsClient
          clientId={clientId}
          clientName={client.name}
          workoutHistory={workoutHistory || []}
          nutritionHistory={nutritionHistory || []}
          documents={documents || []}
        />
      </div>
    )
  } catch (err) {
    console.error("Error in client documents page:", err)
    return notFound()
  }
}
