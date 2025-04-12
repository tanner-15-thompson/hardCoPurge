"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { QuestionnaireData, WorkoutData, NutritionData } from "@/lib/questionnaire-service"
import { saveQuestionnaire } from "@/app/actions/questionnaire-actions"

interface QuestionnaireFormProps {
  clientId: number
  initialData?: QuestionnaireData
}

export function QuestionnaireForm({ clientId, initialData }: QuestionnaireFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const defaultWorkoutData: WorkoutData = {
    goal: "",
    experience: "beginner",
    frequency: 3,
    limitations: [],
    preferences: [],
  }

  const defaultNutritionData: NutritionData = {
    goal: "",
    allergies: [],
    preferences: "balanced",
    mealFrequency: 3,
    restrictions: [],
  }

  const [workoutData, setWorkoutData] = useState<WorkoutData>(initialData?.workout_data || defaultWorkoutData)

  const [nutritionData, setNutritionData] = useState<NutritionData>(initialData?.nutrition_data || defaultNutritionData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await saveQuestionnaire({
        client_id: clientId,
        workout_data: workoutData,
        nutrition_data: nutritionData,
      })

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
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Workout Questionnaire</h2>

        <div>
          <label className="block text-sm font-medium mb-1">What is your primary fitness goal?</label>
          <select
            className="w-full p-2 border rounded-md"
            value={workoutData.goal}
            onChange={(e) => setWorkoutData({ ...workoutData, goal: e.target.value })}
            required
          >
            <option value="">Select a goal</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="strength">Strength</option>
            <option value="endurance">Endurance</option>
            <option value="general_fitness">General Fitness</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Experience Level</label>
          <select
            className="w-full p-2 border rounded-md"
            value={workoutData.experience}
            onChange={(e) => setWorkoutData({ ...workoutData, experience: e.target.value })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">How many days per week can you workout?</label>
          <input
            type="number"
            min="1"
            max="7"
            className="w-full p-2 border rounded-md"
            value={workoutData.frequency}
            onChange={(e) => setWorkoutData({ ...workoutData, frequency: Number.parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Do you have any physical limitations?</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={workoutData.limitations.join(", ")}
            onChange={(e) =>
              setWorkoutData({
                ...workoutData,
                limitations: e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Enter any limitations separated by commas"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Nutrition Questionnaire</h2>

        <div>
          <label className="block text-sm font-medium mb-1">What is your nutrition goal?</label>
          <select
            className="w-full p-2 border rounded-md"
            value={nutritionData.goal}
            onChange={(e) => setNutritionData({ ...nutritionData, goal: e.target.value })}
            required
          >
            <option value="">Select a goal</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
            <option value="performance">Performance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Do you have any food allergies?</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={nutritionData.allergies.join(", ")}
            onChange={(e) =>
              setNutritionData({
                ...nutritionData,
                allergies: e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Enter any allergies separated by commas"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dietary Preference</label>
          <select
            className="w-full p-2 border rounded-md"
            value={nutritionData.preferences}
            onChange={(e) => setNutritionData({ ...nutritionData, preferences: e.target.value })}
          >
            <option value="balanced">Balanced</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">How many meals do you prefer per day?</label>
          <input
            type="number"
            min="1"
            max="6"
            className="w-full p-2 border rounded-md"
            value={nutritionData.mealFrequency}
            onChange={(e) => setNutritionData({ ...nutritionData, mealFrequency: Number.parseInt(e.target.value) })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Questionnaire"}
      </button>
    </form>
  )
}
