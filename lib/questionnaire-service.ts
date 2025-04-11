import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export type WorkoutData = {
  goal: string
  experience: string
  frequency: number
  limitations: string[]
  preferences: string[]
}

export type NutritionData = {
  goal: string
  allergies: string[]
  preferences: string
  mealFrequency: number
  restrictions: string[]
}

export type QuestionnaireData = {
  id?: string
  client_id: number
  workout_data: WorkoutData
  nutrition_data: NutritionData
  created_at?: string
}

export type ClientPlan = {
  id?: string
  client_id: number
  workout_html: string
  nutrition_html: string
  workout_ics?: string
  nutrition_ics?: string
  created_at?: string
}

export async function getClientQuestionnaire(clientId: number): Promise<QuestionnaireData | null> {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase
    .from("client_questionnaires")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    console.error("Error fetching questionnaire:", error)
    return null
  }

  return data as QuestionnaireData
}

export async function getClientPlan(clientId: number): Promise<ClientPlan | null> {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase
    .from("client_plans")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    console.error("Error fetching client plan:", error)
    return null
  }

  return data as ClientPlan
}
