import { getClientPlan } from "@/lib/questionnaire-service"
import Link from "next/link"

export default async function ConsolidatedPlanPage({ params }: { params: { id: string } }) {
  const clientId = Number.parseInt(params.id)

  if (isNaN(clientId)) {
    return <div className="p-4">Invalid client ID</div>
  }

  const plan = await getClientPlan(clientId)

  if (!plan) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Plan</h1>
        <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
          No plan has been created for you yet. Please check back later.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Workout Plan</h2>

          {plan.workout_html ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: plan.workout_html }} />
          ) : (
            <div className="text-gray-500">No workout plan available yet.</div>
          )}

          {plan.workout_ics && (
            <div className="mt-4">
              <a
                href={`data:text/calendar;charset=utf-8,${encodeURIComponent(plan.workout_ics)}`}
                download="workout-schedule.ics"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download Workout Calendar
              </a>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Nutrition Plan</h2>

          {plan.nutrition_html ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: plan.nutrition_html }} />
          ) : (
            <div className="text-gray-500">No nutrition plan available yet.</div>
          )}

          {plan.nutrition_ics && (
            <div className="mt-4">
              <a
                href={`data:text/calendar;charset=utf-8,${encodeURIComponent(plan.nutrition_ics)}`}
                download="nutrition-schedule.ics"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Download Nutrition Calendar
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link href={`/clients/${clientId}`} className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
