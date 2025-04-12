"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuestionnaireData } from "@/lib/questionnaire-service"
import { AlertCircle, CheckCircle, ChevronRight, Edit } from "lucide-react"
import Link from "next/link"

interface QuestionnaireSectionProps {
  client: any
  questionnaire: QuestionnaireData | null
  compact?: boolean
}

export default function QuestionnaireSection({ client, questionnaire, compact = false }: QuestionnaireSectionProps) {
  const hasWorkoutData = questionnaire?.workout_data && Object.keys(questionnaire.workout_data).length > 0
  const hasNutritionData = questionnaire?.nutrition_data && Object.keys(questionnaire.nutrition_data).length > 0

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Questionnaire</CardTitle>
        <CardDescription>Client fitness and nutrition preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {hasWorkoutData ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              )}
              <span className="text-white">Workout Questionnaire</span>
            </div>
            <Link href={`/admin/clients/${client.id}/questionnaire?section=workout`}>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                {hasWorkoutData ? "Edit" : "Complete"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {!compact && hasWorkoutData && (
            <div className="bg-gray-700/50 rounded-md p-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-400">Primary Goal:</p>
                  <p className="text-white">{questionnaire?.workout_data.goal || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Experience Level:</p>
                  <p className="text-white">{questionnaire?.workout_data.experience || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Workout Frequency:</p>
                  <p className="text-white">{questionnaire?.workout_data.frequency || 0} days/week</p>
                </div>
              </div>

              {questionnaire?.workout_data.limitations && questionnaire.workout_data.limitations.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-400">Limitations:</p>
                  <p className="text-white">{questionnaire.workout_data.limitations.join(", ")}</p>
                </div>
              )}

              {questionnaire?.workout_data.preferences && questionnaire.workout_data.preferences.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-400">Preferences:</p>
                  <p className="text-white">{questionnaire.workout_data.preferences.join(", ")}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {hasNutritionData ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              )}
              <span className="text-white">Nutrition Questionnaire</span>
            </div>
            <Link href={`/admin/clients/${client.id}/questionnaire?section=nutrition`}>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                {hasNutritionData ? "Edit" : "Complete"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {!compact && hasNutritionData && (
            <div className="bg-gray-700/50 rounded-md p-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-400">Nutrition Goal:</p>
                  <p className="text-white">{questionnaire?.nutrition_data.goal || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Meal Frequency:</p>
                  <p className="text-white">{questionnaire?.nutrition_data.mealFrequency || 0} meals/day</p>
                </div>
              </div>

              {questionnaire?.nutrition_data.allergies && questionnaire.nutrition_data.allergies.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-400">Allergies:</p>
                  <p className="text-white">{questionnaire.nutrition_data.allergies.join(", ")}</p>
                </div>
              )}

              {questionnaire?.nutrition_data.preferences && (
                <div className="mt-2">
                  <p className="text-gray-400">Preferences:</p>
                  <p className="text-white">{questionnaire.nutrition_data.preferences}</p>
                </div>
              )}

              {questionnaire?.nutrition_data.restrictions && questionnaire.nutrition_data.restrictions.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-400">Restrictions:</p>
                  <p className="text-white">{questionnaire.nutrition_data.restrictions.join(", ")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      {compact && (
        <CardFooter>
          <Link href={`/admin/clients/${client.id}/questionnaire`} className="w-full">
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
              <Edit className="h-4 w-4 mr-2" />
              Manage Questionnaires
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
