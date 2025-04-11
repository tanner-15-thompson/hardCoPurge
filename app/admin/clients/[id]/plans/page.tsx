import { getClientPlan } from "@/lib/questionnaire-service"
import { ClientPlanEditor } from "@/components/client-plan-editor"

export default async function ClientPlanPage({ params }: { params: { id: string } }) {
  const clientId = Number.parseInt(params.id)

  if (isNaN(clientId)) {
    return <div className="p-4">Invalid client ID</div>
  }

  const plan = await getClientPlan(clientId)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Client Plan</h1>

      <ClientPlanEditor clientId={clientId} initialData={plan || undefined} />
    </div>
  )
}
