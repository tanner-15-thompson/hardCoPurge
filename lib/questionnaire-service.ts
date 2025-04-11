import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export interface QuestionnaireData {
  client_id: number
  workout_data: WorkoutData
  nutrition_data: NutritionData
  created_at?: string
  updated_at?: string
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
    // First check if the client exists
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .single()

    if (clientError || !clientData) {
      console.error("Client not found:", clientError)
      return null
    }

    // Then fetch the questionnaire
    const { data, error } = await supabase
      .from("client_questionnaires")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching client questionnaire:", error)
      return null
    }

    // If no questionnaire exists yet, return a default structure
    if (!data || data.length === 0) {
      return {
        client_id: clientId,
        workout_data: {
          goal: "",
          experience: "beginner",
          frequency: 3,
          limitations: [],
          preferences: [],
        },
        nutrition_data: {
          goal: "",
          allergies: [],
          preferences: "balanced",
          mealFrequency: 3,
          restrictions: [],
        },
      }
    }

    // Ensure the data has the expected structure
    const questionnaire = data[0] as QuestionnaireData

    // Ensure workout_data has all required fields
    if (!questionnaire.workout_data) {
      questionnaire.workout_data = {
        goal: "",
        experience: "beginner",
        frequency: 3,
        limitations: [],
        preferences: [],
      }
    } else {
      // Ensure arrays are initialized
      if (!Array.isArray(questionnaire.workout_data.limitations)) {
        questionnaire.workout_data.limitations = []
      }
      if (!Array.isArray(questionnaire.workout_data.preferences)) {
        questionnaire.workout_data.preferences = []
      }
    }

    // Ensure nutrition_data has all required fields
    if (!questionnaire.nutrition_data) {
      questionnaire.nutrition_data = {
        goal: "",
        allergies: [],
        preferences: "balanced",
        mealFrequency: 3,
        restrictions: [],
      }
    } else {
      // Ensure arrays are initialized
      if (!Array.isArray(questionnaire.nutrition_data.allergies)) {
        questionnaire.nutrition_data.allergies = []
      }
      if (!Array.isArray(questionnaire.nutrition_data.restrictions)) {
        questionnaire.nutrition_data.restrictions = []
      }
    }

    return questionnaire
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
