import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import ClientManagementInterface from "./client-management-interface"
import { getClientQuestionnaire } from "@/lib/questionnaire-service"
import { AdminService } from "@/lib/admin-service"

export default async function ClientManagementPage({ params }: { params: { id: string } }) {
  const clientId = Number.parseInt(params.id, 10)

  if (isNaN(clientId)) {
    notFound()
  }

  const supabase = createServerComponentClient({ cookies })

  // Fetch client data
  const client = await AdminService.getClient(clientId)

  if (!client) {
    console.error("Error fetching client")
    notFound()
  }

  // Fetch client questionnaire
  const questionnaire = await getClientQuestionnaire(clientId)

  // Fetch workout plans
  const { data: workoutPlans, error: workoutPlansError } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })

  if (workoutPlansError) {
    console.error("Error fetching workout plans:", workoutPlansError)
  }

  // Fetch nutrition plans
  const { data: nutritionPlans, error: nutritionPlansError } = await supabase
    .from("nutrition_plans")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })

  if (nutritionPlansError) {
    console.error("Error fetching nutrition plans:", nutritionPlansError)
  }

  // Fetch activity logs
  const { data: activityLogs, error: activityLogsError } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(10)

  if (activityLogsError) {
    console.error("Error fetching activity logs:", activityLogsError)
  }

  return (
    <ClientManagementInterface
      client={client}
      questionnaire={questionnaire}
      workoutPlans={workoutPlans || []}
      nutritionPlans={nutritionPlans || []}
      activityLogs={activityLogs || []}
    />
  )
}
