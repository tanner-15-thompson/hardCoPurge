"use client"

import { useState } from "react"
import { Dumbbell, Utensils, Copy, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { QuestionnaireData } from "@/lib/questionnaire-service"
import Link from "next/link"

interface PromptGeneratorProps {
  clientId: number
  clientName: string
  questionnaire: QuestionnaireData | null
}

export default function PromptGenerator({ clientId, clientName, questionnaire }: PromptGeneratorProps) {
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false)
  const [isNutritionDialogOpen, setIsNutritionDialogOpen] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [promptTitle, setPromptTitle] = useState("")
  const [copied, setCopied] = useState(false)

  // Templates for workout and nutrition prompts
  const workoutTemplate = `Create a personalized workout plan for [CLIENT NAME] with the following details:

GOALS:
- Primary fitness goal: [PRIMARY FITNESS GOAL]
- Experience level: [EXPERIENCE LEVEL]
- Workout frequency: [FREQUENCY] days per week

LIMITATIONS & PREFERENCES:
- Physical limitations: [LIMITATIONS]
- Exercise preferences: [PREFERENCES]

The workout plan should include:
1. A weekly schedule with specific exercises for each day
2. Sets, reps, and rest periods for each exercise
3. Warm-up and cool-down routines
4. Progressive overload strategy for 8 weeks
5. Modifications based on limitations

Please format the plan in HTML that can be directly inserted into our client portal. Include headers, sections, and formatting to make it easy to read.`

  const nutritionTemplate = `Create a personalized nutrition plan for [CLIENT NAME] with the following details:

GOALS:
- Primary nutrition goal: [PRIMARY NUTRITION GOAL]
- Meal frequency: [MEAL FREQUENCY] meals per day

DIETARY CONSIDERATIONS:
- Food allergies: [ALLERGIES]
- Dietary preferences: [PREFERENCES]
- Dietary restrictions: [RESTRICTIONS]

The nutrition plan should include:
1. Daily caloric targets and macronutrient breakdown
2. Meal timing recommendations
3. Sample meal plans for 7 days
4. Grocery shopping list
5. Simple recipes for key meals
6. Hydration guidelines

Please format the plan in HTML that can be directly inserted into our client portal. Include headers, sections, and formatting to make it easy to read.`

  const generateWorkoutPrompt = () => {
    if (!questionnaire || !questionnaire.workout_data) {
      setPromptTitle("Missing Questionnaire Data")
      setGeneratedPrompt("Please complete the workout questionnaire first to generate a personalized prompt.")
      setIsWorkoutDialogOpen(true)
      return
    }

    const { goal, experience, frequency, limitations, preferences } = questionnaire.workout_data

    const prompt = workoutTemplate
      .replace("[CLIENT NAME]", clientName)
      .replace("[PRIMARY FITNESS GOAL]", goal || "Not specified")
      .replace("[EXPERIENCE LEVEL]", experience || "Not specified")
      .replace("[FREQUENCY]", frequency?.toString() || "3-4")
      .replace("[LIMITATIONS]", limitations?.join(", ") || "None")
      .replace("[PREFERENCES]", preferences?.join(", ") || "Not specified")

    setPromptTitle("Workout Plan Prompt")
    setGeneratedPrompt(prompt)
    setIsWorkoutDialogOpen(true)
    setCopied(false)
  }

  const generateNutritionPrompt = () => {
    if (!questionnaire || !questionnaire.nutrition_data) {
      setPromptTitle("Missing Questionnaire Data")
      setGeneratedPrompt("Please complete the nutrition questionnaire first to generate a personalized prompt.")
      setIsNutritionDialogOpen(true)
      return
    }

    const { goal, allergies, preferences, mealFrequency, restrictions } = questionnaire.nutrition_data

    const prompt = nutritionTemplate
      .replace("[CLIENT NAME]", clientName)
      .replace("[PRIMARY NUTRITION GOAL]", goal || "Not specified")
      .replace("[MEAL FREQUENCY]", mealFrequency?.toString() || "3")
      .replace("[ALLERGIES]", allergies?.join(", ") || "None")
      .replace("[PREFERENCES]", preferences || "Not specified")
      .replace("[RESTRICTIONS]", restrictions?.join(", ") || "None")

    setPromptTitle("Nutrition Plan Prompt")
    setGeneratedPrompt(prompt)
    setIsNutritionDialogOpen(true)
    setCopied(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button
        onClick={generateWorkoutPrompt}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500"
      >
        <Dumbbell className="h-4 w-4" />
        Generate Workout Prompt
      </Button>

      <Button
        onClick={generateNutritionPrompt}
        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500"
      >
        <Utensils className="h-4 w-4" />
        Generate Nutrition Prompt
      </Button>

      {/* Workout Dialog */}
      <Dialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{promptTitle}</DialogTitle>
            <DialogDescription>
              {promptTitle.includes("Missing") ? (
                <div className="flex items-center gap-2 text-amber-500 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    Questionnaire data is required.{" "}
                    <Link href={`/admin/clients/${clientId}/questionnaire`} className="underline">
                      Complete questionnaire
                    </Link>
                  </span>
                </div>
              ) : (
                "Copy this prompt and use it with your preferred AI tool to generate a personalized workout plan."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {!promptTitle.includes("Missing") && (
              <div className="flex justify-end mb-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex items-center gap-1">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
            )}
            <div className={`p-4 rounded-md ${promptTitle.includes("Missing") ? "bg-amber-950/20" : "bg-gray-700"}`}>
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">{generatedPrompt}</pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nutrition Dialog */}
      <Dialog open={isNutritionDialogOpen} onOpenChange={setIsNutritionDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{promptTitle}</DialogTitle>
            <DialogDescription>
              {promptTitle.includes("Missing") ? (
                <div className="flex items-center gap-2 text-amber-500 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    Questionnaire data is required.{" "}
                    <Link href={`/admin/clients/${clientId}/questionnaire`} className="underline">
                      Complete questionnaire
                    </Link>
                  </span>
                </div>
              ) : (
                "Copy this prompt and use it with your preferred AI tool to generate a personalized nutrition plan."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {!promptTitle.includes("Missing") && (
              <div className="flex justify-end mb-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex items-center gap-1">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
            )}
            <div className={`p-4 rounded-md ${promptTitle.includes("Missing") ? "bg-amber-950/20" : "bg-gray-700"}`}>
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">{generatedPrompt}</pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
