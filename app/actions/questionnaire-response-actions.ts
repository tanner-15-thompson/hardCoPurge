"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

interface SaveQuestionnaireResponseParams {
  clientId: number
  templateId: string
  responses: Record<string, any>
}

export async function saveQuestionnaireResponse({ clientId, templateId, responses }: SaveQuestionnaireResponseParams) {
  const supabase = createServerActionClient({ cookies })

  // Check if client exists
  const { data: clientCheck } = await supabase.from("clients").select("id").eq("id", clientId).single()

  if (!clientCheck) {
    return { success: false, message: "Client not found" }
  }

  // Check if template exists
  const { data: templateCheck } = await supabase
    .from("client_questionnaire_templates")
    .select("id")
    .eq("template_id", templateId)
    .eq("client_id", clientId)
    .single()

  if (!templateCheck) {
    return { success: false, message: "Questionnaire template not found" }
  }

  // Save the responses to the database
  const { error } = await supabase.from("client_questionnaire_responses").upsert({
    client_id: clientId,
    template_id: templateId,
    responses,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error saving questionnaire responses:", error)
    return { success: false, message: error.message }
  }

  // Revalidate paths
  revalidatePath(`/clients/${clientId}/questionnaires`)
  revalidatePath(`/admin/clients/${clientId}`)

  return { success: true, message: "Questionnaire responses saved successfully" }
}

export async function getClientQuestionnaireResponses(clientId: number, templateId?: string) {
  const supabase = createServerActionClient({ cookies })

  let query = supabase.from("client_questionnaire_responses").select("*").eq("client_id", clientId)

  if (templateId) {
    query = query.eq("template_id", templateId)
  }

  const { data, error } = await query.order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching questionnaire responses:", error)
    return []
  }

  return data
}
