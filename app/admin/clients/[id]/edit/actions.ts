"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function updateClient(clientId: number, formData: any) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { error } = await supabase
      .from("clients")
      .update({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        goals: formData.goals,
        fitness_level: formData.fitness_level,
        health_conditions: formData.health_conditions,
        dietary_restrictions: formData.dietary_restrictions,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId)

    if (error) {
      console.error("Error updating client:", error)
      throw new Error("Failed to update client")
    }

    // Log the activity
    await supabase.from("activity_logs").insert({
      client_id: clientId,
      activity_type: "Client Updated",
      description: "Client profile information was updated",
      created_at: new Date().toISOString(),
    })

    revalidatePath(`/admin/clients/${clientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error in updateClient:", error)
    throw error
  }
}
