"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { checkAdminAuth } from "@/lib/admin-auth"

interface UpdateData {
  name: string
  email: string
  phone: string
}

export async function updateClient(clientId: string, data: UpdateData) {
  // Check admin authentication
  const isAdmin = await checkAdminAuth()
  if (!isAdmin) {
    return { error: "Unauthorized access" }
  }

  try {
    const supabase = createServerSupabaseClient()

    // Basic validation
    if (!data.name.trim()) {
      return { error: "Name is required" }
    }

    if (!data.email.trim()) {
      return { error: "Email is required" }
    }

    // Update client in database
    const { error } = await supabase
      .from("clients")
      .update({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId)

    if (error) {
      console.error("Error updating client:", error)
      return { error: error.message }
    }

    // Revalidate the client pages to reflect the changes
    revalidatePath(`/admin/clients/${clientId}`)
    revalidatePath("/admin/clients")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating client:", error)
    return { error: "An unexpected error occurred" }
  }
}
