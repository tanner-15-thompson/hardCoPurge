"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function saveNutritionQuestionnaire(formData: any) {
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

  // First, find the client by name
  const { data: clientData, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .ilike("name", `%${formData.clientName}%`)
    .limit(1)
    .single()

  if (clientError || !clientData) {
    return {
      success: false,
      message: `Client not found with name: ${formData.clientName}. Please check the name or create the client first.`,
    }
  }

  const clientId = clientData.id

  // Check if a questionnaire already exists for this client
  const { data: existingQuestionnaire } = await supabase
    .from("client_questionnaires")
    .select("id, nutrition_data")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Prepare the nutrition data
  const nutritionData = {
    primaryGoal: formData.primaryGoal,
    eventDeadline: formData.eventDeadline,
    secondaryGoals: formData.secondaryGoals,
    currentEatingHabits: formData.currentEatingHabits,
    dietaryPreferences: formData.dietaryPreferences,
    dietaryRestrictions: formData.dietaryRestrictions,
    favoriteFoods: formData.favoriteFoods,
    foodsToAvoid: formData.foodsToAvoid,
    currentWeight: formData.currentWeight,
    height: formData.height,
    age: formData.age,
    gender: formData.gender,
    activityLevel: formData.activityLevel,
    preferredCuisines: formData.preferredCuisines,
    cookingSkillLevel: formData.cookingSkillLevel,
    cookingFrequency: formData.cookingFrequency,
    preferredMealStructure: formData.preferredMealStructure,
    typicalMealTimes: formData.typicalMealTimes,
    weeklyShoppingDay: formData.weeklyShoppingDay,
    city: formData.city,
    budgetConstraints: formData.budgetConstraints,
    timeConstraints: formData.timeConstraints,
    kitchenEquipment: formData.kitchenEquipment,
    restaurantPreferences: formData.restaurantPreferences,
    mainMotivation: formData.mainMotivation,
    challenges: formData.challenges,
    progressTrackingMethod: formData.progressTrackingMethod,
    startDate: formData.startDate,
    preferredPlanStyle: formData.preferredPlanStyle,
    workoutReference: formData.workoutReference,
  }

  let result

  if (existingQuestionnaire) {
    // Update existing questionnaire
    const { error } = await supabase
      .from("client_questionnaires")
      .update({
        nutrition_data: nutritionData,
      })
      .eq("id", existingQuestionnaire.id)

    if (error) {
      console.error("Error updating questionnaire:", error)
      return { success: false, message: error.message }
    }

    result = { success: true, message: "Nutrition questionnaire updated successfully" }
  } else {
    // Create new questionnaire
    const { error } = await supabase.from("client_questionnaires").insert({
      client_id: clientId,
      nutrition_data: nutritionData,
      workout_data: {}, // Empty workout data
    })

    if (error) {
      console.error("Error creating questionnaire:", error)
      return { success: false, message: error.message }
    }

    result = { success: true, message: "Nutrition questionnaire created successfully" }
  }

  // Revalidate paths
  revalidatePath(`/admin/clients/${clientId}`)
  revalidatePath(`/admin/clients/${clientId}/questionnaire`)
  revalidatePath(`/admin/questionnaires/nutrition`)

  return result
}
