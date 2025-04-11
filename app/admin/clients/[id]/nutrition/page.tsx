import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { ClientHeaderNav } from "@/components/client-header-nav"
import { NutritionDisplay } from "@/components/nutrition-display"

export default async function ClientNutritionPage({ params }: { params: { id: string } }) {
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

    return (
      <div>
        <ClientHeaderNav clientId={clientId} clientName={client.name} />

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h1 className="text-xl font-bold text-gray-800">{client.name} - Nutrition Plan</h1>
          </div>

          <div className="p-6">
            <NutritionDisplay clientId={clientId} />
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in client nutrition page:", err)
    return notFound()
  }
}
