import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Flame, User, Mail, Phone, Calendar, Clock, ArrowRight, FileText, Dumbbell, Utensils } from "lucide-react"
import Link from "next/link"

// Helper function to format relative time (e.g., "2 days ago")
const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
    }
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return formatDate(date)
  }
}

// Helper function to format date for display
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      return (
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl" role="alert">
            <p className="font-medium">Invalid client ID</p>
            <p className="text-sm mt-1">Please check the URL and try again.</p>
          </div>
        </div>
      )
    }

    // Fetch client data
    const { data: client, error } = await supabase
      .from("clients")
      .select("id, name, email, phone, created_at, goals, fitness_level, health_conditions, dietary_restrictions")
      .eq("id", clientId)
      .single()

    if (error) {
      console.error("Error fetching client:", error)
      return (
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl" role="alert">
            <p className="font-medium">Client not found</p>
            <p className="text-sm mt-1">
              The client you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </div>
        </div>
      )
    }

    // Fetch questionnaire data
    const { data: workoutQuestionnaire } = await supabase
      .from("client_questionnaires")
      .select("workout_data")
      .eq("client_id", clientId)
      .single()

    const { data: nutritionQuestionnaire } = await supabase
      .from("client_questionnaires")
      .select("nutrition_data")
      .eq("client_id", clientId)
      .single()

    // Fetch workout plans
    const { data: workoutPlans } = await supabase
      .from("workout_plans")
      .select("id, title, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(3)

    // Fetch nutrition plans
    const { data: nutritionPlans } = await supabase
      .from("nutrition_plans")
      .select("id, title, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(3)

    // Fetch recent activity logs
    const { data: activityLogs } = await supabase
      .from("activity_logs")
      .select("id, activity_type, description, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(5)

    const createdAt = client?.created_at ? new Date(client.created_at) : new Date()
    const clientSince = formatRelativeTime(createdAt)

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Client header */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 rounded-full p-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{client.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-gray-400">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/clients/${clientId}/edit`}
                className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Edit Profile
              </Link>
              <Link
                href={`/admin/clients/${clientId}/plans`}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Manage Plans
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center text-gray-400 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">Client Since</span>
              </div>
              <p className="text-white">{clientSince}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center text-gray-400 mb-1">
                <Flame className="h-4 w-4 mr-1" />
                <span className="text-sm">Fitness Level</span>
              </div>
              <p className="text-white">{client.fitness_level || "Not specified"}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center text-gray-400 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">Last Activity</span>
              </div>
              <p className="text-white">
                {activityLogs && activityLogs.length > 0
                  ? formatRelativeTime(new Date(activityLogs[0].created_at))
                  : "No activity yet"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Client details */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Client Details</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Goals</h3>
                  <p className="text-gray-400">{client.goals || "No goals specified"}</p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Health Conditions</h3>
                  <p className="text-gray-400">{client.health_conditions || "No health conditions specified"}</p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Dietary Restrictions</h3>
                  <p className="text-gray-400">{client.dietary_restrictions || "No dietary restrictions specified"}</p>
                </div>
              </div>
            </div>

            {/* Recent Plans */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Plans</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-3">Workout Plans</h3>
                  {workoutPlans && workoutPlans.length > 0 ? (
                    <div className="space-y-2">
                      {workoutPlans.map((plan) => (
                        <Link
                          key={plan.id}
                          href={`/admin/clients/${clientId}/workout-plan/${plan.id}`}
                          className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <div>
                            <p className="text-white font-medium">{plan.title}</p>
                            <p className="text-sm text-gray-400">
                              Created {formatRelativeTime(new Date(plan.created_at))}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No workout plans created yet</p>
                  )}
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-3">Nutrition Plans</h3>
                  {nutritionPlans && nutritionPlans.length > 0 ? (
                    <div className="space-y-2">
                      {nutritionPlans.map((plan) => (
                        <Link
                          key={plan.id}
                          href={`/admin/clients/${clientId}/nutrition-plan/${plan.id}`}
                          className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <div>
                            <p className="text-white font-medium">{plan.title}</p>
                            <p className="text-sm text-gray-400">
                              Created {formatRelativeTime(new Date(plan.created_at))}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No nutrition plans created yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Prompt Generator */}
          <div>
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Prompt Generator</h2>

              <div className="space-y-4">
                <p className="text-gray-400">
                  Generate AI prompts based on client's questionnaire data to create personalized plans.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium text-gray-300 mb-2">Workout Prompt</h3>
                      {workoutQuestionnaire?.workout_data ? (
                        <Link
                          href={`/admin/clients/${clientId}/generate-workout-prompt`}
                          className="flex items-center justify-between w-full p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                        >
                          <span className="font-medium">Generate Workout Prompt</span>
                          <Dumbbell className="h-5 w-5" />
                        </Link>
                      ) : (
                        <div className="p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-yellow-400 mb-2">Workout questionnaire not completed</p>
                          <Link
                            href={`/admin/clients/${clientId}/questionnaire`}
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Complete questionnaire first
                          </Link>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-300 mb-2">Nutrition Prompt</h3>
                      {nutritionQuestionnaire?.nutrition_data ? (
                        <Link
                          href={`/admin/clients/${clientId}/generate-nutrition-prompt`}
                          className="flex items-center justify-between w-full p-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                        >
                          <span className="font-medium">Generate Nutrition Prompt</span>
                          <Utensils className="h-5 w-5" />
                        </Link>
                      ) : (
                        <div className="p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-yellow-400 mb-2">Nutrition questionnaire not completed</p>
                          <Link
                            href={`/admin/clients/${clientId}/questionnaire`}
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Complete questionnaire first
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>

              {activityLogs && activityLogs.length > 0 ? (
                <div className="space-y-3">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="border-l-2 border-purple-500 pl-3">
                      <p className="text-white font-medium">{log.activity_type}</p>
                      <p className="text-sm text-gray-400">{log.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(new Date(log.created_at))}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No activity recorded yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in client details page:", err)
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl" role="alert">
          <p className="font-medium">An error occurred</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      </div>
    )
  }
}
