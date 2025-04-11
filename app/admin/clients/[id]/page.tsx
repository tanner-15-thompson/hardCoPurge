import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Flame } from "lucide-react"
import { differenceInDays } from "date-fns"

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

// Helper function to get default workout based on day of week
const getDefaultWorkout = (dayOfWeek: number) => {
  const workouts = [
    { title: "Sunday Rest Day" },
    { title: "Monday Strength Training" },
    { title: "Tuesday Cardio" },
    { title: "Wednesday Active Recovery" },
    { title: "Thursday Strength Training" },
    { title: "Friday HIIT" },
    { title: "Saturday Long Run" },
  ]
  return workouts[dayOfWeek] || { title: "Workout" }
}

export default async function ClientDashboardPage({ params }: { params: { id: string } }) {
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
      .select("id, name, email, phone, created_at")
      .eq("id", clientId)
      .single()

    if (error) {
      console.error("Error fetching client:", error)
    }

    // For development purposes, let's be more permissive
    const clientName = client?.name || "Client"

    // Set the target date to 2025-04-07
    const targetDate = new Date("2025-04-07T00:00:00")

    // Define Phase 1 start date and overall target end date
    const phase1StartDate = new Date("2025-04-01T00:00:00")
    const overallEndDate = new Date("2025-10-01T00:00:00")

    // Calculate overall goal progress
    const totalTime = overallEndDate.getTime() - phase1StartDate.getTime()
    const timeElapsed = targetDate.getTime() - phase1StartDate.getTime()
    const overallGoalProgressCalc = Math.min(100, Math.max(0, (timeElapsed / totalTime) * 100))

    // Fetch workout completion data for the week
    const startOfWeek = new Date(targetDate)
    startOfWeek.setDate(targetDate.getDate() - targetDate.getDay()) // Start from Sunday

    const weeklyCompletions: Record<number, boolean> = {}
    try {
      // Get all completions for the week
      const { data: completions } = await supabase
        .from("workout_completions")
        .select("day_id, completed_at")
        .eq("client_id", clientId)
        .gte("day_id", `day-${startOfWeek.toISOString().split("T")[0]}`)
        .lte("day_id", `day-${targetDate.toISOString().split("T")[0]}`)

      if (completions) {
        // Map completions to days of week
        completions.forEach((completion) => {
          const dayDate = new Date(completion.day_id.replace("day-", ""))
          const dayOfWeek = dayDate.getDay()
          weeklyCompletions[dayOfWeek] = true
        })
      }
    } catch (err) {
      console.log("Error fetching workout completions:", err)
    }

    // Calculate weekly activity percentages
    const weeklyActivity = [0, 1, 2, 3, 4, 5, 6].map((day) => {
      // For days in the future, return 0
      if (day > targetDate.getDay()) return 0

      // For today and past days, check if completed
      return weeklyCompletions[day] ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 30)
    })

    // Calculate workout streak based on Phase 1 start date
    let workoutStreak = 0
    try {
      const { data: workoutLogs } = await supabase
        .from("simple_workout_logs")
        .select("logged_at")
        .eq("client_id", clientId)
        .gte("logged_at", phase1StartDate.toISOString()) // Only consider workouts after Phase 1 start
        .order("logged_at", { ascending: false })

      if (workoutLogs && workoutLogs.length > 0) {
        let currentDate = new Date(workoutLogs[0].logged_at)
        workoutStreak = 1

        for (let i = 1; i < workoutLogs.length; i++) {
          const nextDate = new Date(workoutLogs[i].logged_at)
          const diff = differenceInDays(currentDate, nextDate)

          if (diff === 1) {
            workoutStreak++
            currentDate = nextDate
          } else {
            break // Streak broken
          }
        }
      }
    } catch (err) {
      console.log("Error fetching workout streak:", err)
    }

    return (
      <div>
        {/* Hero section with greeting */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-500 text-white">
          <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
            <p className="text-purple-100 font-medium">{formatDate(targetDate)}</p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">Hello, {clientName.split(" ")[0]}</h1>
            <p className="mt-2 text-purple-100 max-w-md">Track your fitness journey and stay on top of your goals.</p>
          </div>
        </div>

        {/* Progress section */}
        <div className="max-w-5xl mx-auto px-4 mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Your Progress</h2>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
            <div className="mb-6">
              <h3 className="font-medium text-gray-200">Overall Goal Progress</h3>
              <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${overallGoalProgressCalc}%` }}></div>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {overallGoalProgressCalc.toFixed(1)}% towards your overall goal (Timeline: 26 weeks to October)
              </p>
            </div>

            <div className="flex items-center mb-4">
              <Flame className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium text-gray-200">Workout Streak: {workoutStreak} days</h3>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in client dashboard page:", err)
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
