"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NutritionQuestionnaireForm } from "./nutrition-questionnaire-form"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"
import { WorkoutQuestionnaireForm } from "./workout-questionnaire-form"

interface ClientQuestionnairesProps {
  clientId: number
  clientName: string
}

export function ClientQuestionnaires({ clientId, clientName }: ClientQuestionnairesProps) {
  const [activeTab, setActiveTab] = useState("workout")
  const [existingData, setExistingData] = useState<{
    workout_data: any | null
    nutrition_data: any | null
  }>({
    workout_data: null,
    nutrition_data: null,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchExistingQuestionnaire() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("client_questionnaires")
          .select("workout_data, nutrition_data")
          .eq("client_id", clientId)
          .single()

        if (data) {
          setExistingData({
            workout_data: data.workout_data,
            nutrition_data: data.nutrition_data,
          })
        }
      } catch (error) {
        console.error("Error fetching questionnaire data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExistingQuestionnaire()
  }, [clientId, supabase])

  return (
    <div className="mt-6 bg-gray-900 rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Client Questionnaires: {clientName}</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="workout">Workout Questionnaire</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Questionnaire</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="mt-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading workout questionnaire...</div>
          ) : (
            <WorkoutQuestionnaireForm
              clientId={clientId}
              clientName={clientName}
              existingData={existingData.workout_data}
            />
          )}
        </TabsContent>

        <TabsContent value="nutrition" className="mt-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading nutrition questionnaire...</div>
          ) : (
            <NutritionQuestionnaireForm
              clientId={clientId}
              clientName={clientName}
              existingData={existingData.nutrition_data}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
