import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft, Dumbbell } from "lucide-react"
import ClientWorkoutPlan from "./client-page"
import { Button } from "@/components/ui/button"

export default async function WorkoutPlanPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  let workoutHtml = ""
  let error = null

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      throw new Error("Invalid client ID")
    }

    // First try client_workouts table
    const { data: workoutData, error: workoutError } = await supabase
      .from("client_workouts")
      .select("workout_html")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (workoutError) {
      console.error("Error fetching from client_workouts:", workoutError)

      // Try workout_plans table as fallback
      const { data: planData, error: planError } = await supabase
        .from("workout_plans")
        .select("html_content, content")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(1)

      if (planError) {
        console.error("Error fetching from workout_plans:", planError)
        error = planError
      } else if (planData && planData.length > 0) {
        // Try both possible column names
        workoutHtml = planData[0].html_content || planData[0].content || ""
      }
    } else if (workoutData && workoutData.length > 0) {
      workoutHtml = workoutData[0].workout_html || ""
    }

    // If we still don't have workout HTML, try one more fallback
    if (!workoutHtml) {
      // This is a fallback for testing - in production, you'd remove this
      workoutHtml = `
        <h1>Weekly Workout Plan</h1>
        <p>This is your personalized workout plan. Follow it closely for best results.</p>
        
        <h2>Monday</h2>
        <p>Focus: Upper Body Strength</p>
        <ul>
          <li>Bench Press: 4 sets of 8-10 reps</li>
          <li>Rows: 4 sets of 10-12 reps</li>
          <li>Shoulder Press: 3 sets of 10-12 reps</li>
          <li>Bicep Curls: 3 sets of 12-15 reps</li>
          <li>Tricep Extensions: 3 sets of 12-15 reps</li>
        </ul>
        
        <h2>Tuesday</h2>
        <p>Focus: Cardio and Core</p>
        <ul>
          <li>Running: 20 minutes at moderate pace</li>
          <li>Plank: 3 sets of 45 seconds</li>
          <li>Russian Twists: 3 sets of 20 reps</li>
          <li>Leg Raises: 3 sets of 15 reps</li>
        </ul>
        
        <h2>Wednesday</h2>
        <p>Focus: Lower Body Strength</p>
        <ul>
          <li>Squats: 4 sets of 8-10 reps</li>
          <li>Deadlifts: 4 sets of 8-10 reps</li>
          <li>Lunges: 3 sets of 12 reps per leg</li>
          <li>Calf Raises: 3 sets of 15-20 reps</li>
        </ul>
        
        <h2>Thursday</h2>
        <p>Focus: Rest or Light Activity</p>
        <ul>
          <li>Walking: 30 minutes</li>
          <li>Stretching: Full body, 15 minutes</li>
        </ul>
        
        <h2>Friday</h2>
        <p>Focus: Full Body Circuit</p>
        <ul>
          <li>Circuit 1: 3 rounds
            <ul>
              <li>Push-ups: 12 reps</li>
              <li>Bodyweight Squats: 15 reps</li>
              <li>Dumbbell Rows: 12 reps per arm</li>
            </ul>
          </li>
          <li>Circuit 2: 3 rounds
            <ul>
              <li>Shoulder Press: 12 reps</li>
              <li>Lunges: 10 reps per leg</li>
              <li>Plank: 45 seconds</li>
            </ul>
          </li>
        </ul>
        
        <h2>Saturday</h2>
        <p>Focus: Cardio and Mobility</p>
        <ul>
          <li>HIIT: 20 minutes (30 seconds work, 30 seconds rest)</li>
          <li>Mobility Work: 15 minutes focusing on hips and shoulders</li>
        </ul>
        
        <h2>Sunday</h2>
        <p>Focus: Complete Rest</p>
        <p>Take the day off to allow your body to recover fully.</p>
      `
    }
  } catch (err) {
    console.error("Error in workout plan page:", err)
    error = err
  }

  return (
    <div className="pb-20 sm:pb-0">
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link
              href={`/clients/${params.id}`}
              className="mr-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Full Workout Plan</h1>
              <p className="text-purple-100">Your complete training program</p>
            </div>
            <Link href={`/clients/${params.id}/workout`} className="ml-auto">
              <Button className="bg-white text-purple-700 hover:bg-purple-50">
                <Dumbbell className="h-4 w-4 mr-2" />
                Log Today's Workout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
            <p className="font-medium">Error fetching workout plan</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        ) : workoutHtml ? (
          <ClientWorkoutPlan workoutHtml={workoutHtml} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Dumbbell className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No workout plan available yet</h3>
            <p className="mt-2">Your coach hasn't uploaded a workout plan for you yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
