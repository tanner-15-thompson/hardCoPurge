"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveNutritionQuestionnaire } from "./actions"

type NutritionFormData = {
  clientName: string
  primaryGoal: string
  eventDeadline: string
  secondaryGoals: string
  currentEatingHabits: string
  dietaryPreferences: string
  dietaryRestrictions: string
  favoriteFoods: string
  foodsToAvoid: string
  currentWeight: number
  height: string
  age: number
  gender: string
  activityLevel: string
  preferredCuisines: string
  cookingSkillLevel: string
  cookingFrequency: string
  preferredMealStructure: string
  typicalMealTimes: string
  weeklyShoppingDay: string
  city: string
  budgetConstraints: string
  timeConstraints: string
  kitchenEquipment: string
  restaurantPreferences: string
  mainMotivation: string
  challenges: string
  progressTrackingMethod: string
  startDate: string
  preferredPlanStyle: string
  workoutReference: string
}

const defaultFormData: NutritionFormData = {
  clientName: "",
  primaryGoal: "",
  eventDeadline: "",
  secondaryGoals: "",
  currentEatingHabits: "",
  dietaryPreferences: "",
  dietaryRestrictions: "",
  favoriteFoods: "",
  foodsToAvoid: "",
  currentWeight: 0,
  height: "",
  age: 0,
  gender: "",
  activityLevel: "",
  preferredCuisines: "",
  cookingSkillLevel: "",
  cookingFrequency: "",
  preferredMealStructure: "",
  typicalMealTimes: "",
  weeklyShoppingDay: "",
  city: "",
  budgetConstraints: "",
  timeConstraints: "",
  kitchenEquipment: "",
  restaurantPreferences: "",
  mainMotivation: "",
  challenges: "",
  progressTrackingMethod: "",
  startDate: "",
  preferredPlanStyle: "",
  workoutReference: "",
}

export function NutritionQuestionnaireForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<NutritionFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    setFormData({
      ...formData,
      [name]: type === "number" ? (value ? Number.parseFloat(value) : 0) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await saveNutritionQuestionnaire(formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        router.refresh()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium mb-1">
            Client Name
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="primaryGoal" className="block text-sm font-medium mb-1">
            Primary Nutritional Goal
          </label>
          <input
            type="text"
            id="primaryGoal"
            name="primaryGoal"
            value={formData.primaryGoal}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="eventDeadline" className="block text-sm font-medium mb-1">
            Specific Event or Deadline
          </label>
          <input
            type="date"
            id="eventDeadline"
            name="eventDeadline"
            value={formData.eventDeadline}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="secondaryGoals" className="block text-sm font-medium mb-1">
            Secondary Nutrition Goals
          </label>
          <input
            type="text"
            id="secondaryGoals"
            name="secondaryGoals"
            value={formData.secondaryGoals}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="currentEatingHabits" className="block text-sm font-medium mb-1">
            Current Eating Habits
          </label>
          <textarea
            id="currentEatingHabits"
            name="currentEatingHabits"
            value={formData.currentEatingHabits}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="dietaryPreferences" className="block text-sm font-medium mb-1">
            Dietary Preferences
          </label>
          <input
            type="text"
            id="dietaryPreferences"
            name="dietaryPreferences"
            value={formData.dietaryPreferences}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="dietaryRestrictions" className="block text-sm font-medium mb-1">
            Dietary Restrictions
          </label>
          <input
            type="text"
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="favoriteFoods" className="block text-sm font-medium mb-1">
            Favorite Foods
          </label>
          <input
            type="text"
            id="favoriteFoods"
            name="favoriteFoods"
            value={formData.favoriteFoods}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="foodsToAvoid" className="block text-sm font-medium mb-1">
            Foods to Avoid
          </label>
          <input
            type="text"
            id="foodsToAvoid"
            name="foodsToAvoid"
            value={formData.foodsToAvoid}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="currentWeight" className="block text-sm font-medium mb-1">
            Current Weight (lbs)
          </label>
          <input
            type="number"
            id="currentWeight"
            name="currentWeight"
            value={formData.currentWeight || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium mb-1">
            Height
          </label>
          <input
            type="text"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., 5'10&quot;"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label htmlFor="activityLevel" className="block text-sm font-medium mb-1">
            Activity Level
          </label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Activity Level</option>
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
          </select>
        </div>

        <div>
          <label htmlFor="preferredCuisines" className="block text-sm font-medium mb-1">
            Preferred Cuisines or Flavors
          </label>
          <input
            type="text"
            id="preferredCuisines"
            name="preferredCuisines"
            value={formData.preferredCuisines}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="cookingSkillLevel" className="block text-sm font-medium mb-1">
            Cooking Skill Level
          </label>
          <select
            id="cookingSkillLevel"
            name="cookingSkillLevel"
            value={formData.cookingSkillLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Skill Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="cookingFrequency" className="block text-sm font-medium mb-1">
            Cooking Frequency
          </label>
          <input
            type="text"
            id="cookingFrequency"
            name="cookingFrequency"
            value={formData.cookingFrequency}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., 3-4 times per week"
          />
        </div>

        <div>
          <label htmlFor="preferredMealStructure" className="block text-sm font-medium mb-1">
            Preferred Meal Structure
          </label>
          <input
            type="text"
            id="preferredMealStructure"
            name="preferredMealStructure"
            value={formData.preferredMealStructure}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., 3 meals + 2 snacks"
          />
        </div>

        <div>
          <label htmlFor="typicalMealTimes" className="block text-sm font-medium mb-1">
            Typical Meal Times
          </label>
          <input
            type="text"
            id="typicalMealTimes"
            name="typicalMealTimes"
            value={formData.typicalMealTimes}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Breakfast 7am, Lunch 12pm, Dinner 6pm"
          />
        </div>

        <div>
          <label htmlFor="weeklyShoppingDay" className="block text-sm font-medium mb-1">
            Weekly Shopping Day
          </label>
          <input
            type="text"
            id="weeklyShoppingDay"
            name="weeklyShoppingDay"
            value={formData.weeklyShoppingDay}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="budgetConstraints" className="block text-sm font-medium mb-1">
            Budget Constraints
          </label>
          <input
            type="text"
            id="budgetConstraints"
            name="budgetConstraints"
            value={formData.budgetConstraints}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., $100/week for groceries"
          />
        </div>

        <div>
          <label htmlFor="timeConstraints" className="block text-sm font-medium mb-1">
            Time Constraints for Meal Prep
          </label>
          <input
            type="text"
            id="timeConstraints"
            name="timeConstraints"
            value={formData.timeConstraints}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., 30 min max per meal"
          />
        </div>

        <div>
          <label htmlFor="kitchenEquipment" className="block text-sm font-medium mb-1">
            Access to Kitchen Equipment
          </label>
          <input
            type="text"
            id="kitchenEquipment"
            name="kitchenEquipment"
            value={formData.kitchenEquipment}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Instant Pot, blender, etc."
          />
        </div>

        <div>
          <label htmlFor="restaurantPreferences" className="block text-sm font-medium mb-1">
            Fast Food and Restaurant Preferences
          </label>
          <input
            type="text"
            id="restaurantPreferences"
            name="restaurantPreferences"
            value={formData.restaurantPreferences}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="mainMotivation" className="block text-sm font-medium mb-1">
            Main Motivation
          </label>
          <textarea
            id="mainMotivation"
            name="mainMotivation"
            value={formData.mainMotivation}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={2}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="challenges" className="block text-sm font-medium mb-1">
            Challenges in Sticking to a Nutrition Plan
          </label>
          <textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="progressTrackingMethod" className="block text-sm font-medium mb-1">
            Preferred Progress Tracking Method
          </label>
          <input
            type="text"
            id="progressTrackingMethod"
            name="progressTrackingMethod"
            value={formData.progressTrackingMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., weekly weigh-ins, photos, etc."
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="preferredPlanStyle" className="block text-sm font-medium mb-1">
            Preferred Plan Style
          </label>
          <select
            id="preferredPlanStyle"
            name="preferredPlanStyle"
            value={formData.preferredPlanStyle}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Plan Style</option>
            <option value="Detailed Calendar">Detailed Calendar</option>
            <option value="Flexible Blueprint">Flexible Blueprint</option>
          </select>
        </div>

        <div>
          <label htmlFor="workoutReference" className="block text-sm font-medium mb-1">
            Workout Reference
          </label>
          <input
            type="text"
            id="workoutReference"
            name="workoutReference"
            value={formData.workoutReference}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Reference to workout plan if applicable"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Nutrition Questionnaire"}
        </button>
      </div>
    </form>
  )
}
