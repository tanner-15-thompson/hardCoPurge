"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

type WorkoutData = {
  primaryGoal: string
  eventDeadline: string
  secondaryGoals: string
  fitnessLevel: string
  trainingExperience: string
  currentStats: string
  bodyComposition: string
  preferredTrainingStyle: string
  trainingDaysPerWeek: string
  workoutDuration: string
  specialSkills: string
  injuries: string
  exercisesCannotPerform: string
  equipmentAccess: string
  timeConstraints: string
  mainMotivation: string
  challenges: string
  progressTrackingMethod: string
  startDate: string
  defaultWorkoutTime: string
  timezone: string
}

type SaveWorkoutQuestionnaireParams = {
  client_id: number
  workout_data: WorkoutData
}

export async function saveWorkoutQuestionnaire({ client_id, workout_data }: SaveWorkoutQuestionnaireParams) {
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
  const { data: clientCheck } = await supabase.from("clients").select("id").eq("id", client_id).single()

  if (!clientCheck) {
    return { success: false, message: "Client not found" }
  }

  // Check if questionnaire already exists for this client
  const { data: existingQuestionnaire } = await supabase
    .from("client_questionnaires")
    .select("id")
    .eq("client_id", client_id)
    .maybeSingle()

  let result

  if (existingQuestionnaire) {
    // Update existing questionnaire
    result = await supabase
      .from("client_questionnaires")
      .update({
        workout_data: workout_data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingQuestionnaire.id)
  } else {
    // Create new questionnaire
    result = await supabase.from("client_questionnaires").insert({
      client_id: client_id,
      workout_data: workout_data,
      nutrition_data: {}, // Initialize with empty object
    })
  }

  if (result.error) {
    console.error("Error saving questionnaire:", result.error)
    return { success: false, message: result.error.message }
  }

  revalidatePath(`/admin/questionnaires/workout`)
  revalidatePath(`/admin/clients/${client_id}`)
  revalidatePath(`/admin/clients/${client_id}/questionnaire`)

  return { success: true, message: "Workout questionnaire saved successfully" }
}
