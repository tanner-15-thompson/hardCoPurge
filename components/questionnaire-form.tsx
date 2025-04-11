"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { QuestionnaireData, WorkoutData, NutritionData } from "@/lib/questionnaire-service"
import { saveQuestionnaire } from "@/app/actions/questionnaire-actions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface QuestionnaireFormProps {
  clientId: number
  initialData?: QuestionnaireData
  activeSection?: "workout" | "nutrition"
}

export function QuestionnaireForm({ clientId, initialData, activeSection = "workout" }: QuestionnaireFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Default workout data structure
  const defaultWorkoutData: WorkoutData = {
    goal: "",
    experience: "beginner",
    frequency: 3,
    limitations: [],
    preferences: [],
  }

  // Default nutrition data structure
  const defaultNutritionData: NutritionData = {
    goal: "",
    allergies: [],
    preferences: "balanced",
    mealFrequency: 3,
    restrictions: [],
  }

  // Initialize state with provided data or defaults
  const [workoutData, setWorkoutData] = useState<WorkoutData>(initialData?.workout_data || defaultWorkoutData)
  const [nutritionData, setNutritionData] = useState<NutritionData>(initialData?.nutrition_data || defaultNutritionData)

  // Handle form submission
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

  // Function to switch between sections
  const switchSection = (section: "workout" | "nutrition") => {
    router.push(`/admin/clients/${clientId}/questionnaire?section=${section}`)
  }

  // Render the workout questionnaire form
  const renderWorkoutForm = () => (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="goal" className="text-base font-medium">
            Primary Fitness Goal
          </Label>
          <select
            id="goal"
            className="w-full p-2 mt-1 border rounded-md"
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
          <Label htmlFor="experience" className="text-base font-medium">
            Experience Level
          </Label>
          <select
            id="experience"
            className="w-full p-2 mt-1 border rounded-md"
            value={workoutData.experience}
            onChange={(e) => setWorkoutData({ ...workoutData, experience: e.target.value })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <Label htmlFor="frequency" className="text-base font-medium">
            Workout Frequency (days per week)
          </Label>
          <Input
            id="frequency"
            type="number"
            min="1"
            max="7"
            className="mt-1"
            value={workoutData.frequency}
            onChange={(e) => setWorkoutData({ ...workoutData, frequency: Number.parseInt(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="limitations" className="text-base font-medium">
            Physical Limitations or Injuries
          </Label>
          <Textarea
            id="limitations"
            className="mt-1"
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
            placeholder="Enter any limitations separated by commas (e.g., knee pain, shoulder injury)"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="preferences" className="text-base font-medium">
            Exercise Preferences
          </Label>
          <Textarea
            id="preferences"
            className="mt-1"
            value={workoutData.preferences.join(", ")}
            onChange={(e) =>
              setWorkoutData({
                ...workoutData,
                preferences: e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Enter exercise preferences separated by commas (e.g., weightlifting, running, yoga)"
            rows={3}
          />
        </div>
      </div>
    </Card>
  )

  // Render the nutrition questionnaire form
  const renderNutritionForm = () => (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="nutritionGoal" className="text-base font-medium">
            Nutrition Goal
          </Label>
          <select
            id="nutritionGoal"
            className="w-full p-2 mt-1 border rounded-md"
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
          <Label htmlFor="dietaryPreference" className="text-base font-medium">
            Dietary Preference
          </Label>
          <select
            id="dietaryPreference"
            className="w-full p-2 mt-1 border rounded-md"
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
          <Label htmlFor="mealFrequency" className="text-base font-medium">
            Preferred Meals Per Day
          </Label>
          <Input
            id="mealFrequency"
            type="number"
            min="1"
            max="6"
            className="mt-1"
            value={nutritionData.mealFrequency}
            onChange={(e) => setNutritionData({ ...nutritionData, mealFrequency: Number.parseInt(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="allergies" className="text-base font-medium">
            Food Allergies
          </Label>
          <Textarea
            id="allergies"
            className="mt-1"
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
            placeholder="Enter any food allergies separated by commas (e.g., nuts, dairy, shellfish)"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="restrictions" className="text-base font-medium">
            Dietary Restrictions
          </Label>
          <Textarea
            id="restrictions"
            className="mt-1"
            value={nutritionData.restrictions.join(", ")}
            onChange={(e) =>
              setNutritionData({
                ...nutritionData,
                restrictions: e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Enter any dietary restrictions separated by commas (e.g., gluten-free, low-carb)"
            rows={3}
          />
        </div>
      </div>
    </Card>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md flex items-center ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {activeSection === "workout" ? renderWorkoutForm() : renderNutritionForm()}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Questionnaire"
          )}
        </Button>
      </div>
    </form>
  )
}
