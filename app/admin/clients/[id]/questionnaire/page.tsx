import { getClientQuestionnaire } from "@/lib/questionnaire-service"
import { QuestionnaireForm } from "@/components/questionnaire-form"

export default async function ClientQuestionnairePage({ params }: { params: { id: string } }) {
  const clientId = Number.parseInt(params.id)

  if (isNaN(clientId)) {
    return <div className="p-4">Invalid client ID</div>
  }

  const questionnaire = await getClientQuestionnaire(clientId)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Client Questionnaire</h1>

      <QuestionnaireForm clientId={clientId} initialData={questionnaire || undefined} />
    </div>
  )
}
