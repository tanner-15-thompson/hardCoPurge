import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Flame, Target } from "lucide-react"
import { parseWorkoutHtml } from "@/components/workout-parser"

// Import the real-time activities component at the top of the file
import RealTimeActivities from "@/components/real-time-activities"

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

// Helper function to convert date to YYYY-MM-DD format
const formatDateString = (date: Date) => {
  return date.toISOString().split("T")[0]
}

export default async function ClientDashboardPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      return (
        <div className="max-w-md mx-auto px-4 py-8">
          <div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl"
            role="alert"
          >
            <p className="font-medium">Invalid client ID</p>
            <p className="text-sm mt-1">Please check the URL and try again.</p>
          </div>
        </div>
      )
    }

    // Fetch client data
    const { data: client, error } = await supabase
      .from("clients")
      .select("id, name, email, phone")
      .eq("id", clientId)
      .single()

    if (error) {
      console.error("Error fetching client:", error)
    }

    // For development purposes, let's be more permissive
    const clientName = client?.name || "Client"

    // Set the target date to 2025-04-07
    const targetDate = new Date("2025-04-07T00:00:00")

    // Fetch workout HTML
    let workoutHtml = null
    try {
      const { data: workoutData } = await supabase
        .from("client_workouts")
        .select("workout_html")
        .eq("client_id", clientId)
        .single()

      if (workoutData?.workout_html) {
        workoutHtml = workoutData.workout_html
      }
    } catch (err) {
      console.log("Error fetching workout data:", err)
      // Use default workout if there's an error
    }

    // Calculate estimated duration
    let duration = 70 // Default duration
    const focus = "Full body strength and endurance" // Default focus
    try {
      if (workoutHtml) {
        const { exercises } = parseWorkoutHtml(workoutHtml)
        let totalDuration = 0
        exercises.forEach((exercise) => {
          if (exercise.duration) {
            const durationMatch = exercise.duration.match(/(\d+)/)
            if (durationMatch) {
              totalDuration += Number.parseInt(durationMatch[1])
            }
          }
        })
        duration = totalDuration
      }
    } catch (err) {
      console.error("Error parsing workout HTML:", err)
    }

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

    // Fetch monthly goals progress
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)
    const daysInMonth = endOfMonth.getDate()

    // Calculate workout goal progress
    let workoutGoalProgress = 0
    const workoutGoalTarget = 20
    try {
      const { data: monthlyCompletions, count } = await supabase
        .from("workout_completions")
        .select("day_id", { count: "exact" })
        .eq("client_id", clientId)
        .gte("day_id", `day-${startOfMonth.toISOString().split("T")[0]}`)
        .lte("day_id", `day-${endOfMonth.toISOString().split("T")[0]}`)

      workoutGoalProgress = count || 0
    } catch (err) {
      console.log("Error fetching monthly workout completions:", err)
    }

    // Calculate nutrition goal progress
    let nutritionGoalProgress = 0
    const nutritionGoalTarget = 30
    try {
      const { data: nutritionLogs, count } = await supabase
        .from("nutrition_logs")
        .select("id", { count: "exact" })
        .eq("client_id", clientId)
        .gte("logged_at", startOfMonth.toISOString())
        .lte("logged_at", endOfMonth.toISOString())

      nutritionGoalProgress = count || 0
    } catch (err) {
      console.log("Error fetching nutrition logs:", err)
      // Simulate some progress for demo purposes
      nutritionGoalProgress = Math.floor((targetDate.getDate() / daysInMonth) * nutritionGoalTarget * 0.6)
    }

    // Calculate progress within the current phase
    // Define Phase 1 duration (assuming 4 weeks/28 days for Phase 1)
    const phase1StartDate = new Date("2025-04-01T00:00:00")
    const phase1Duration = 28 // 4 weeks
    const daysIntoPhase1 = Math.ceil((targetDate.getTime() - phase1StartDate.getTime()) / (1000 * 60 * 60 * 24))
    const currentPhaseProgress = Math.min(100, Math.max(0, Math.round((daysIntoPhase1 / phase1Duration) * 100)))

    // Define Phase 1 start date and overall target end date
    const overallEndDate = new Date("2025-10-01T00:00:00")

    // Calculate days elapsed since Phase 1 started
    const totalDaysInProgram = Math.ceil((overallEndDate.getTime() - phase1StartDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysElapsed = Math.ceil((targetDate.getTime() - phase1StartDate.getTime()) / (1000 * 60 * 60 * 24))
    const overallGoalProgress = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDaysInProgram) * 100)))

    // Calculate workout streak based on consecutive days with "Mark as Completed" button clicks
    let workoutStreak = 0
    let lastCompletionDate: Date | null = null
    const streakDetails: string[] = []

    try {
      // Get all workout completions for this client, ordered by date
      const { data: completions } = await supabase
        .from("workout_completions")
        .select("day_id, completed_at")
        .eq("client_id", clientId)
        .order("day_id", { ascending: false })

      if (completions && completions.length > 0) {
        // Create a map of completed dates for easier lookup
        const completedDates = new Map<string, boolean>()
        completions.forEach((completion) => {
          const dateStr = completion.day_id.replace("day-", "")
          completedDates.set(dateStr, true)
        })

        // Start from the current date and work backwards
        const currentDateStr = formatDateString(targetDate)

        // Check if today's workout is completed
        if (completedDates.has(currentDateStr)) {
          workoutStreak = 1
          lastCompletionDate = new Date(currentDateStr)
          streakDetails.push(formatDate(lastCompletionDate))

          // Check previous days
          const checkDate = new Date(targetDate)

          // Look back up to 30 days to find the streak
          for (let i = 1; i < 30; i++) {
            checkDate.setDate(checkDate.getDate() - 1)
            const checkDateStr = formatDateString(checkDate)

            // If this day has a completion, continue the streak
            if (completedDates.has(checkDateStr)) {
              workoutStreak++
              streakDetails.push(formatDate(checkDate))
            } else {
              // Streak is broken
              break
            }
          }
        }
      }
    } catch (err) {
      console.log("Error calculating workout streak:", err)
    }

    // Define phase targets
    const phaseTargets = [
      { category: "Strength", name: "Squat", value: "335", unit: "lbs" },
      { category: "Strength", name: "Deadlift", value: "335", unit: "lbs" },
      { category: "Strength", name: "Bench Press", value: "215", unit: "lbs" },
      { category: "Cardio", name: "12-Mile Ruck", value: "2:50:00", unit: "" },
      { category: "Cardio", name: "5-Mile Run", value: "37:30", unit: "min" },
      { category: "Cardio", name: "2-Mile Run", value: "13:45", unit: "min" },
      { category: "Cardio", name: "VO2 Max", value: "Increase", unit: "" },
    ]

    return (
      <div className="pb-20 sm:pb-0">
        {/* Hero section with greeting */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-500 text-white">
          <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
            <p className="text-purple-100 font-medium">{formatDate(targetDate)}</p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">Hello, {clientName.split(" ")[0]}</h1>
            <p className="mt-2 text-purple-100 max-w-md">Track your fitness journey and stay on top of your goals.</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="max-w-5xl mx-auto px-4 -mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 grid grid-cols-2 gap-4">
            <Link
              href={`/clients/${clientId}/workout`}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
            >
              <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.5 17H17.5M6.5 7H17.5M4 12H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium">Log Workout</span>
            </Link>
            <Link
              href={`/clients/${clientId}/nutrition`}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
            >
              <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 5V19M18 11H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium">Log Nutrition</span>
            </Link>
          </div>
        </div>

        {/* Workout Streak - Made more prominent */}
        <div className="max-w-5xl mx-auto px-4 mt-8">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center">
              <Flame className="h-10 w-10 mr-4" />
              <div>
                <h2 className="text-2xl font-bold">Workout Streak: {workoutStreak} days</h2>
                <p className="text-yellow-100 mt-1">
                  {workoutStreak > 0
                    ? `Keep it up! You've completed workouts ${workoutStreak} days in a row.`
                    : "Start your streak by completing today's workout!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's plan */}
        <div className="max-w-5xl mx-auto px-4 mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Plan</h2>
            <div className="flex space-x-2">
              <Link
                href={`/clients/${clientId}/workout-plan`}
                className="text-sm text-purple-600 dark:text-purple-400 font-medium flex items-center"
              >
                View full workout plan
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <Link
                href={`/clients/${clientId}/nutrition-plan`}
                className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center ml-4"
              >
                View full nutrition plan
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Day 7: 2025-04-07 (Monday) - Strength & Conditioning</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full body strength and endurance</p>
                </div>
                <div className="ml-auto flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>70 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress section */}
        <div className="max-w-5xl mx-auto px-4 mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Progress</h2>
          </div>

          {/* New Progress Tracking System */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="mb-6">
              <h3 className="font-medium">Phase Progress</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2">
                <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${currentPhaseProgress}%` }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {currentPhaseProgress}% towards the end of this phase
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium">Overall Goal Progress</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${overallGoalProgress}%` }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {overallGoalProgress}% towards your overall goal ({daysElapsed} days elapsed,{" "}
                {totalDaysInProgram - daysElapsed} days remaining)
              </p>
            </div>

            {/* Phase Targets */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium text-lg">Phase Targets</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strength Targets */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-3">Strength</h4>
                  <ul className="space-y-2">
                    {phaseTargets
                      .filter((target) => target.category === "Strength")
                      .map((target, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">{target.name}</span>
                          <span className="font-medium text-blue-700 dark:text-blue-300">
                            {target.value} {target.unit}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Cardio Targets */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-3">Cardio</h4>
                  <ul className="space-y-2">
                    {phaseTargets
                      .filter((target) => target.category === "Cardio")
                      .map((target, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">{target.name}</span>
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {target.value} {target.unit}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="max-w-5xl mx-auto px-4 mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>

          {/* Use the new real-time component */}
          <RealTimeActivities clientId={clientId} />
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in client dashboard page:", err)
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl"
          role="alert"
        >
          <p className="font-medium">An error occurred</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      </div>
    )
  }
}
