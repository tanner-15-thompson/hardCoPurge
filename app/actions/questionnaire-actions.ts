"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { QuestionnaireData, ClientPlan } from "@/lib/questionnaire-service"
import { revalidatePath } from "next/cache"

export async function saveQuestionnaire(data: QuestionnaireData) {
  const supabase = createServerActionClient({ cookies })

  try {
    // Check if admin is logged in
    const { data: session } = await supabase.auth.getSession()
    if (!session.session) {
      return { success: false, message: "You must be logged in to save questionnaires" }
    }

    // Validate client exists
    const { data: clientExists, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", data.client_id)
      .single()

    if (clientError || !clientExists) {
      return { success: false, message: "Client not found" }
    }

    // Check if a questionnaire already exists for this client
    const { data: existingQuestionnaire, error: fetchError } = await supabase
      .from("client_questionnaires")
      .select("id")
      .eq("client_id", data.client_id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error("Error checking existing questionnaire:", fetchError)
      return { success: false, message: `Error checking existing questionnaire: ${fetchError.message}` }
    }

    let result

    // If questionnaire exists, update it
    if (existingQuestionnaire && existingQuestionnaire.length > 0) {
      const { error: updateError } = await supabase
        .from("client_questionnaires")
        .update({
          workout_data: data.workout_data,
          nutrition_data: data.nutrition_data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingQuestionnaire[0].id)

      if (updateError) {
        console.error("Error updating questionnaire:", updateError)
        return { success: false, message: `Error updating questionnaire: ${updateError.message}` }
      }

      result = { success: true, message: "Questionnaire updated successfully" }
    }
    // Otherwise, insert a new one
    else {
      const { error: insertError } = await supabase.from("client_questionnaires").insert({
        client_id: data.client_id,
        workout_data: data.workout_data,
        nutrition_data: data.nutrition_data,
      })

      if (insertError) {
        console.error("Error saving questionnaire:", insertError)
        return { success: false, message: `Error saving questionnaire: ${insertError.message}` }
      }

      result = { success: true, message: "Questionnaire saved successfully" }
    }

    // Log the activity
    await supabase.from("client_activities").insert({
      client_id: data.client_id,
      activity_type: "questionnaire_updated",
      details: "Questionnaire was updated",
      created_by: session.session.user.id,
    })

    // Revalidate the client page to show updated data
    revalidatePath(`/admin/clients/${data.client_id}`)
    revalidatePath(`/admin/clients/${data.client_id}/questionnaire`)

    return result
  } catch (error) {
    console.error("Error in saveQuestionnaire:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
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
