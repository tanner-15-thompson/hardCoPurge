"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function logPromptGeneration(clientId: number, promptType: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data: session } = await supabase.auth.getSession()

    if (!session.session) {
      throw new Error("Unauthorized")
    }

    await supabase.from("activity_logs").insert({
      client_id: clientId,
      activity_type: "Prompt Generated",
      description: `Generated a ${promptType} prompt`,
      created_by: session.session.user.id,
    })

    return { success: true }
  } catch (error) {
    console.error("Error logging prompt generation:", error)
    return { success: false, error }
  }
}
