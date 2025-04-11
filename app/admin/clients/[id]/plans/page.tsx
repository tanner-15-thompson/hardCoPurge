import { getClientPlan } from "@/lib/questionnaire-service"
import { ClientPlanEditor } from "@/components/client-plan-editor"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ClientPlanPage({ params }: { params: { id: string } }) {
  const clientId = Number.parseInt(params.id)

  if (isNaN(clientId)) {
    return <div className="p-4">Invalid client ID</div>
  }

  const plan = await getClientPlan(clientId)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        href={`/admin/clients/${clientId}`}
        className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Client Details
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-white">Client Plan</h1>

      <ClientPlanEditor clientId={clientId} initialData={plan || undefined} />
    </div>
  )
}
