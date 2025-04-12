import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getClientQuestionnaireTemplates } from "@/app/actions/questionnaire-template-actions"
import { ClientQuestionnaireManager } from "./client-questionnaire-manager"

export const metadata = {
  title: "Client Questionnaires",
  description: "Manage client-specific questionnaires",
}

export default async function ClientQuestionnairesPage({ params }: { params: { id: string } }) {
  const clientId = Number.parseInt(params.id)

  if (isNaN(clientId)) {
    return notFound()
  }

  const supabase = createServerComponentClient({ cookies })

  // Fetch client data
  const { data: client, error } = await supabase.from("clients").select("id, name, email").eq("id", clientId).single()

  if (error || !client) {
    return notFound()
  }

  // Fetch questionnaire templates
  const workoutTemplates = await getClientQuestionnaireTemplates(clientId, "workout")
  const nutritionTemplates = await getClientQuestionnaireTemplates(clientId, "nutrition")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Questionnaires for {client.name}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Manage custom questionnaires for this client</p>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="workout">Workout Questionnaires</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Questionnaires</TabsTrigger>
        </TabsList>

        <TabsContent value="workout">
          <Suspense fallback={<div>Loading workout questionnaires...</div>}>
            <ClientQuestionnaireManager clientId={clientId} category="workout" templates={workoutTemplates} />
          </Suspense>
        </TabsContent>

        <TabsContent value="nutrition">
          <Suspense fallback={<div>Loading nutrition questionnaires...</div>}>
            <ClientQuestionnaireManager clientId={clientId} category="nutrition" templates={nutritionTemplates} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
