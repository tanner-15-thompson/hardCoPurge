"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { QuestionnaireData } from "@/lib/questionnaire-service"
import { AlertCircle, Check, Copy, Dumbbell, Link2, Utensils } from "lucide-react"
import Link from "next/link"
import { logActivity } from "@/app/actions/log-activity"

interface PromptGenerationSectionProps {
  client: any
  questionnaire: QuestionnaireData | null
  compact?: boolean
}

export default function PromptGenerationSection({
  client,
  questionnaire,
  compact = false,
}: PromptGenerationSectionProps) {
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false)
  const [nutritionDialogOpen, setNutritionDialogOpen] = useState(false)
  const [workoutPrompt, setWorkoutPrompt] = useState("")
  const [nutritionPrompt, setNutritionPrompt] = useState("")
  const [copied, setCopied] = useState(false)

  const hasWorkoutData = questionnaire?.workout_data && Object.keys(questionnaire.workout_data).length > 0
  const hasNutritionData = questionnaire?.nutrition_data && Object.keys(questionnaire.nutrition_data).length > 0

  const generateWorkoutPrompt = async () => {
    if (!hasWorkoutData) {
      return
    }

    const { goal, experience, frequency, limitations, preferences } = questionnaire!.workout_data

    const template = `Create a personalized HARD Fitness workout plan for ${client.name} with the following details:

CLIENT PROFILE:
- Name: ${client.name}
- Primary Fitness Goal: ${goal || "Not specified"}
- Experience Level: ${experience || "Not specified"}
- Workout Frequency: ${frequency || 3} days per week
- Physical Limitations: ${limitations?.join(", ") || "None"}
- Exercise Preferences: ${preferences?.join(", ") || "Not specified"}
- Health Considerations: ${client.health_conditions || "None"}

PLAN REQUIREMENTS:
1. Create a structured weekly workout schedule
2. Include a mix of strength training, cardio, and recovery
3. Provide specific exercises with sets, reps, and rest periods
4. Include warm-up and cool-down routines
5. Add progression guidelines for 4-6 weeks
6. Include modifications for any health considerations
7. Provide clear instructions for proper form on key exercises
8. Add tips for maximizing results and preventing plateaus

Please format the plan in HTML that can be directly inserted into our client portal. Include headers, sections, and formatting to make it easy to read.`

    setWorkoutPrompt(template)
    setWorkoutDialogOpen(true)

    // Log the activity
    await logActivity({
      clientId: client.id,
      activityType: "Prompt Generated",
      description: "Generated workout prompt",
    })
  }

  const generateNutritionPrompt = async () => {
    if (!hasNutritionData) {
      return
    }

    const { goal, allergies, preferences, mealFrequency, restrictions } = questionnaire!.nutrition_data

    const template = `Create a personalized HARD Fitness nutrition plan for ${client.name} with the following details:

CLIENT PROFILE:
- Name: ${client.name}
- Nutrition Goal: ${goal || "Not specified"}
- Meal Frequency: ${mealFrequency || 3} meals per day
- Food Allergies: ${allergies?.join(", ") || "None"}
- Dietary Preferences: ${preferences || "Not specified"}
- Dietary Restrictions: ${restrictions?.join(", ") || "None"}
- Health Considerations: ${client.health_conditions || "None"}

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

Please format the plan in HTML that can be directly inserted into our client portal. Include headers, sections, and formatting to make it easy to read.`

    setNutritionPrompt(template)
    setNutritionDialogOpen(true)

    // Log the activity
    await logActivity({
      clientId: client.id,
      activityType: "Prompt Generated",
      description: "Generated nutrition prompt",
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Prompt Generation</CardTitle>
          <CardDescription>Generate AI prompts for personalized plans</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              onClick={generateWorkoutPrompt}
              disabled={!hasWorkoutData}
              className={`w-full ${
                hasWorkoutData ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              <Dumbbell className="h-4 w-4 mr-2" />
              Generate Workout Prompt
            </Button>

            {!hasWorkoutData && (
              <div className="flex items-center text-amber-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Complete workout questionnaire first</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={generateNutritionPrompt}
              disabled={!hasNutritionData}
              className={`w-full ${
                hasNutritionData ? "bg-green-600 hover:bg-green-500" : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              <Utensils className="h-4 w-4 mr-2" />
              Generate Nutrition Prompt
            </Button>

            {!hasNutritionData && (
              <div className="flex items-center text-amber-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Complete nutrition questionnaire first</span>
              </div>
            )}
          </div>
        </CardContent>
        {compact && (
          <CardFooter>
            <Link href={`/admin/clients/${client.id}?tab=prompts`} className="w-full">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                <Link2 className="h-4 w-4 mr-2" />
                View All Prompts
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>

      {/* Workout Prompt Dialog */}
      <Dialog open={workoutDialogOpen} onOpenChange={setWorkoutDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Workout Plan Prompt</DialogTitle>
            <DialogDescription className="text-gray-400">
              Copy this prompt and use it with your preferred AI tool to generate a personalized workout plan.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-4">
            <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg whitespace-pre-wrap text-sm font-mono overflow-auto max-h-[500px]">
              {workoutPrompt}
            </pre>
            <button
              onClick={() => copyToClipboard(workoutPrompt)}
              className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
              aria-label="Copy to clipboard"
            >
              {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => copyToClipboard(workoutPrompt)} className="bg-blue-600 hover:bg-blue-500">
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
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nutrition Prompt Dialog */}
      <Dialog open={nutritionDialogOpen} onOpenChange={setNutritionDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nutrition Plan Prompt</DialogTitle>
            <DialogDescription className="text-gray-400">
              Copy this prompt and use it with your preferred AI tool to generate a personalized nutrition plan.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-4">
            <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg whitespace-pre-wrap text-sm font-mono overflow-auto max-h-[500px]">
              {nutritionPrompt}
            </pre>
            <button
              onClick={() => copyToClipboard(nutritionPrompt)}
              className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
              aria-label="Copy to clipboard"
            >
              {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => copyToClipboard(nutritionPrompt)} className="bg-green-600 hover:bg-green-500">
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
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
