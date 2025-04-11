import { getClientQuestionnaire } from "@/lib/questionnaire-service"
import { QuestionnaireForm } from "@/components/questionnaire-form"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getClient } from "@/lib/admin-service"

export default async function ClientQuestionnairePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { section?: string }
}) {
  const clientId = Number.parseInt(params.id)
  const activeSection = searchParams.section || "workout" // Default to workout if not specified

  if (isNaN(clientId)) {
    return notFound()
  }

  // Fetch client data to display client name
  const client = await getClient(clientId)
  if (!client) {
    return notFound()
  }

  // Fetch questionnaire data
  const questionnaire = await getClientQuestionnaire(clientId)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Client Questionnaire</h1>
        <p className="text-gray-600">Client: {client.name}</p>
      </div>

      <Tabs defaultValue={activeSection} className="w-full">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="workout" className="flex-1">
            Workout Questionnaire
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex-1">
            Nutrition Questionnaire
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="mt-0">
          <QuestionnaireForm clientId={clientId} initialData={questionnaire || undefined} activeSection="workout" />
        </TabsContent>

        <TabsContent value="nutrition" className="mt-0">
          <QuestionnaireForm clientId={clientId} initialData={questionnaire || undefined} activeSection="nutrition" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
