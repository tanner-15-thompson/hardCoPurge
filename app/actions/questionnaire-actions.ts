"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export type QuestionnaireData = {
  client_id: number
  workout_data: any
  nutrition_data: any
}

export type ClientPlan = {
  client_id: number
  workout_html: string
  nutrition_html: string
  workout_ics: string
  nutrition_ics: string
}

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

  // Check if questionnaire already exists
  const { data: existingQuestionnaire } = await supabase
    .from("client_questionnaires")
    .select("*")
    .eq("client_id", data.client_id)
    .single()

  let result

  if (existingQuestionnaire) {
    // Update existing questionnaire
    result = await supabase
      .from("client_questionnaires")
      .update({
        workout_data: data.workout_data,
        nutrition_data: data.nutrition_data,
        updated_at: new Date().toISOString(),
      })
      .eq("client_id", data.client_id)
  } else {
    // Insert new questionnaire
    result = await supabase.from("client_questionnaires").insert({
      client_id: data.client_id,
      workout_data: data.workout_data,
      nutrition_data: data.nutrition_data,
    })
  }

  if (result.error) {
    console.error("Error saving questionnaire:", result.error)
    return { success: false, message: result.error.message }
  }

  revalidatePath(`/admin/clients/${data.client_id}/questionnaires`)

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
