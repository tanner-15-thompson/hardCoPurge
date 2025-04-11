"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { QuestionnaireData, ClientPlan } from "@/lib/questionnaire-service"
import { revalidatePath } from "next/cache"

export async function saveQuestionnaire(data: QuestionnaireData) {
  const supabase = createServerActionClient({ cookies })

  // Check if admin
  const { data: session } = await supabase.auth.getSession()
  const { data: adminCheck } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", session.session?.user.id || "")
    .single()

  if (!adminCheck) {
    return { success: false, message: "Unauthorized" }
  }

  const { error } = await supabase.from("client_questionnaires").upsert({
    client_id: data.client_id,
    workout_data: data.workout_data,
    nutrition_data: data.nutrition_data,
  })

  if (error) {
    console.error("Error saving questionnaire:", error)
    return { success: false, message: error.message }
  }

  revalidatePath(`/admin/clients/${data.client_id}`)
  revalidatePath(`/admin/clients/${data.client_id}/questionnaire`)

  return { success: true, message: "Questionnaire saved successfully" }
}

export async function saveClientPlan(data: ClientPlan) {
  const supabase = createServerActionClient({ cookies })

  // Check if admin
  const { data: session } = await supabase.auth.getSession()
  const { data: adminCheck } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", session.session?.user.id || "")
    .single()

  if (!adminCheck) {
    return { success: false, message: "Unauthorized" }
  }

  const { error } = await supabase.from("client_plans").upsert({
    client_id: data.client_id,
    workout_html: data.workout_html,
    nutrition_html: data.nutrition_html,
    workout_ics: data.workout_ics,
    nutrition_ics: data.nutrition_ics,
  })

  if (error) {
    console.error("Error saving client plan:", error)
    return { success: false, message: error.message }
  }

  revalidatePath(`/admin/clients/${data.client_id}`)
  revalidatePath(`/admin/clients/${data.client_id}/plans`)

  return { success: true, message: "Client plan saved successfully" }
}
