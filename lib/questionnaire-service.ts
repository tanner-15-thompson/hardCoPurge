import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export interface QuestionnaireData {
  client_id: number
  workout_data: WorkoutData
  nutrition_data: NutritionData
}

export interface WorkoutData {
  goal: string
  experience: string
  frequency: number
  limitations: string[]
  preferences: string[]
}

export interface NutritionData {
  goal: string
  allergies: string[]
  preferences: string
  mealFrequency: number
  restrictions: string[]
}

export interface ClientPlan {
  client_id: number
  workout_html: string
  nutrition_html: string
  workout_ics: string
  nutrition_ics: string
}

export async function getClientQuestionnaire(clientId: number): Promise<QuestionnaireData | null> {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data, error } = await supabase
      .from("client_questionnaires")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false }) // Order by creation date to get the latest
      .limit(1) // Limit to one result
      .single() // Still use single() to ensure only one result is returned

    if (error) {
      console.error("Error fetching client questionnaire:", error)
      return null
    }

    return data as QuestionnaireData
  } catch (err) {
    console.error("Error in getClientQuestionnaire:", err)
    return null
  }
}

export async function getClientPlan(clientId: number): Promise<ClientPlan | null> {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data, error } = await supabase.from("client_plans").select("*").eq("client_id", clientId).single()

    if (error) {
      console.error("Error fetching client plan:", error)
      return null
    }

    return data as ClientPlan
  } catch (err) {
    console.error("Error in getClientPlan:", err)
    return null
  }
}
