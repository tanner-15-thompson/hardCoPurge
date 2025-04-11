"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuestionnaireData } from "@/lib/questionnaire-service"
import { AlertCircle, CheckCircle } from "lucide-react"

interface FullQuestionnaireViewProps {
  questionnaire: QuestionnaireData | null
}

export default function FullQuestionnaireView({ questionnaire }: FullQuestionnaireViewProps) {
  const hasWorkoutData = questionnaire?.workout_data && Object.keys(questionnaire.workout_data).length > 0
  const hasNutritionData = questionnaire?.nutrition_data && Object.keys(questionnaire.nutrition_data).length > 0

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center">
            {hasWorkoutData ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            )}
            <CardTitle className="text-white">Workout Questionnaire</CardTitle>
          </div>
          <CardDescription>Client's workout preferences and goals</CardDescription>
        </CardHeader>
        <CardContent>
          {hasWorkoutData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-md p-4">
                  <h3 className="text-white font-medium mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-400 text-sm">Primary Goal:</p>
                      <p className="text-white">{questionnaire?.workout_data.goal || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Experience Level:</p>
                      <p className="text-white">{questionnaire?.workout_data.experience || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Workout Frequency:</p>
                      <p className="text-white">{questionnaire?.workout_data.frequency || 0} days/week</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-md p-4">
                  <h3 className="text-white font-medium mb-2">Preferences & Limitations</h3>
                  <div className="space-y-2">
                    {questionnaire?.workout_data.preferences && questionnaire.workout_data.preferences.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm">Exercise Preferences:</p>
                        <p className="text-white">{questionnaire.workout_data.preferences.join(", ")}</p>
                      </div>
                    )}
                    {questionnaire?.workout_data.limitations && questionnaire.workout_data.limitations.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm">Limitations/Injuries:</p>
                        <p className="text-white">{questionnaire.workout_data.limitations.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400">No workout questionnaire data available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center">
            {hasNutritionData ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            )}
            <CardTitle className="text-white">Nutrition Questionnaire</CardTitle>
          </div>
          <CardDescription>Client's nutrition preferences and goals</CardDescription>
        </CardHeader>
        <CardContent>
          {hasNutritionData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-md p-4">
                  <h3 className="text-white font-medium mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-400 text-sm">Nutrition Goal:</p>
                      <p className="text-white">{questionnaire?.nutrition_data.goal || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Meal Frequency:</p>
                      <p className="text-white">{questionnaire?.nutrition_data.mealFrequency || 0} meals/day</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-md p-4">
                  <h3 className="text-white font-medium mb-2">Dietary Considerations</h3>
                  <div className="space-y-2">
                    {questionnaire?.nutrition_data.allergies && questionnaire.nutrition_data.allergies.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm">Food Allergies:</p>
                        <p className="text-white">{questionnaire.nutrition_data.allergies.join(", ")}</p>
                      </div>
                    )}
                    {questionnaire?.nutrition_data.restrictions &&
                      questionnaire.nutrition_data.restrictions.length > 0 && (
                        <div>
                          <p className="text-gray-400 text-sm">Dietary Restrictions:</p>
                          <p className="text-white">{questionnaire.nutrition_data.restrictions.join(", ")}</p>
                        </div>
                      )}
                    {questionnaire?.nutrition_data.preferences && (
                      <div>
                        <p className="text-gray-400 text-sm">Food Preferences:</p>
                        <p className="text-white">{questionnaire.nutrition_data.preferences}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400">No nutrition questionnaire data available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
