"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { QuestionnaireTemplate } from "@/components/questionnaire-template-manager"

export async function saveQuestionnaireTemplate(clientId: number, template: QuestionnaireTemplate) {
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

  // Check if client exists
  const { data: clientCheck } = await supabase.from("clients").select("id").eq("id", clientId).single()

  if (!clientCheck) {
    return { success: false, message: "Client not found" }
  }

  // Save the template to the database
  const { error } = await supabase.from("client_questionnaire_templates").upsert({
    client_id: clientId,
    template_id: template.id,
    category: template.category,
    name: template.name,
    description: template.description,
    questions: template.questions,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error saving questionnaire template:", error)
    return { success: false, message: error.message }
  }

  // Revalidate paths
  revalidatePath(`/clients/${clientId}/questionnaires`)
  revalidatePath(`/admin/clients/${clientId}`)

  return { success: true, message: "Questionnaire template saved successfully" }
}

export async function getClientQuestionnaireTemplates(clientId: number, category?: string) {
  const supabase = createServerActionClient({ cookies })

  let query = supabase.from("client_questionnaire_templates").select("*").eq("client_id", clientId)

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query.order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching questionnaire templates:", error)
    return []
  }

  return data as Array<{
    id: string
    client_id: number
    template_id: string
    category: string
    name: string
    description: string
    questions: any[]
    created_at: string
    updated_at: string
  }>
}

export async function deleteQuestionnaireTemplate(templateId: string) {
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

  // Get the client ID for revalidation
  const { data: template } = await supabase
    .from("client_questionnaire_templates")
    .select("client_id")
    .eq("id", templateId)
    .single()

  // Delete the template
  const { error } = await supabase.from("client_questionnaire_templates").delete().eq("id", templateId)

  if (error) {
    console.error("Error deleting questionnaire template:", error)
    return { success: false, message: error.message }
  }

  // Revalidate paths if we have the client ID
  if (template?.client_id) {
    revalidatePath(`/clients/${template.client_id}/questionnaires`)
    revalidatePath(`/admin/clients/${template.client_id}`)
  }

  return { success: true, message: "Questionnaire template deleted successfully" }
}
