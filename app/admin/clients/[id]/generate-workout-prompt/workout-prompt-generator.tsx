"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { logActivity } from "@/app/actions/log-activity"

interface WorkoutPromptGeneratorProps {
  client: {
    id: number
    name: string
    goals?: string
    fitness_level?: string
    health_conditions?: string
  }
  workoutData: any
}

export default function WorkoutPromptGenerator({ client, workoutData }: WorkoutPromptGeneratorProps) {
  const [copied, setCopied] = useState(false)

  // Generate the workout prompt
  const generateWorkoutPrompt = () => {
    // Extract data from the workout questionnaire
    const {
      primary_goal = "improve overall fitness",
      training_days_per_week = "3-4",
      session_duration = "45-60 minutes",
      preferred_training_style = "balanced approach",
      equipment_access = "basic home equipment",
      exercise_experience = "intermediate",
      injuries_limitations = "none",
      cardio_preference = "moderate intensity",
      strength_training_experience = "some experience",
    } = workoutData || {}

    // Template for the workout prompt
    const promptTemplate = `Create a personalized HARD Fitness workout plan for ${client.name} with the following details:

CLIENT PROFILE:
- Name: ${client.name}
- Primary Fitness Goal: ${primary_goal}
- Current Fitness Level: ${client.fitness_level || exercise_experience}
- Health Considerations: ${client.health_conditions || injuries_limitations || "None specified"}

WORKOUT PREFERENCES:
- Training Days Per Week: ${training_days_per_week}
- Session Duration: ${session_duration}
- Preferred Training Style: ${preferred_training_style}
- Equipment Access: ${equipment_access}
- Cardio Preference: ${cardio_preference}
- Strength Training Experience: ${strength_training_experience}

PLAN REQUIREMENTS:
1. Create a structured weekly workout schedule
2. Include a mix of strength training, cardio, and recovery
3. Provide specific exercises with sets, reps, and rest periods
4. Include warm-up and cool-down routines
5. Add progression guidelines for 4-6 weeks
6. Include modifications for any health considerations
7. Provide clear instructions for proper form on key exercises
8. Add tips for maximizing results and preventing plateaus

Please format the plan professionally with clear sections, day-by-day breakdown, and exercise details.`

    return promptTemplate
  }

  const workoutPrompt = generateWorkoutPrompt()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(workoutPrompt)
      setCopied(true)

      // Log the activity
      await logActivity({
        clientId: client.id,
        activityType: "Prompt Generated",
        description: "Generated workout prompt",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg whitespace-pre-wrap text-sm font-mono overflow-auto max-h-[500px]">
          {workoutPrompt}
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
        </button>
      </div>
      <div className="flex justify-end">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </>
          )}
        </button>
      </div>
    </div>
  )
}
