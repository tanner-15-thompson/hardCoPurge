"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { logActivity } from "@/app/actions/log-activity"

interface NutritionPromptGeneratorProps {
  client: {
    id: number
    name: string
    goals?: string
    dietary_restrictions?: string
  }
  nutritionData: any
}

export default function NutritionPromptGenerator({ client, nutritionData }: NutritionPromptGeneratorProps) {
  const [copied, setCopied] = useState(false)

  // Generate the nutrition prompt
  const generateNutritionPrompt = () => {
    // Extract data from the nutrition questionnaire
    const {
      nutrition_goal = "improve overall health",
      current_diet = "mixed diet",
      meal_frequency = "3 meals per day",
      food_preferences = "balanced diet",
      food_allergies = "none",
      dietary_restrictions = "none",
      cooking_skill = "intermediate",
      meal_prep_time = "30-45 minutes",
      calorie_awareness = "moderate",
    } = nutritionData || {}

    // Template for the nutrition prompt
    const promptTemplate = `Create a personalized HARD Fitness nutrition plan for ${client.name} with the following details:

CLIENT PROFILE:
- Name: ${client.name}
- Nutrition Goal: ${nutrition_goal}
- Current Diet: ${current_diet}
- Dietary Restrictions: ${client.dietary_restrictions || dietary_restrictions || "None specified"}
- Food Allergies: ${food_allergies}

NUTRITION PREFERENCES:
- Meal Frequency: ${meal_frequency}
- Food Preferences: ${food_preferences}
- Cooking Skill Level: ${cooking_skill}
- Meal Prep Time Available: ${meal_prep_time}
- Calorie Awareness: ${calorie_awareness}

PLAN REQUIREMENTS:
1. Create a structured weekly meal plan with breakfast, lunch, dinner, and snacks
2. Include macronutrient breakdown for each meal
3. Provide specific recipes with ingredients and preparation instructions
4. Include grocery shopping list organized by food categories
5. Add meal prep strategies to save time
6. Include hydration recommendations
7. Provide guidance on portion control
8. Add tips for eating out and social situations
9. Include supplement recommendations if appropriate

Please format the plan professionally with clear sections, day-by-day breakdown, and recipe details.`

    return promptTemplate
  }

  const nutritionPrompt = generateNutritionPrompt()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(nutritionPrompt)
      setCopied(true)

      // Log the activity
      await logActivity({
        clientId: client.id,
        activityType: "Prompt Generated",
        description: "Generated nutrition prompt",
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
          {nutritionPrompt}
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
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
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
