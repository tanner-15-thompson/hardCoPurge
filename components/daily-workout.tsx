"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, Save, CheckCircle, Dumbbell } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { logActivity } from "@/app/actions/log-activity"
import DOMPurify from "dompurify"

type DailyWorkoutProps = {
  clientId: number
}

// Function to parse workout HTML and extract exercises
function parseWorkoutHtml(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const exerciseElements = doc.querySelectorAll("li")
  const exercises = Array.from(exerciseElements).map((exercise) => {
    return {
      name: exercise.textContent?.trim() || "",
    }
  })

  return { exercises }
}

export function DailyWorkout({ clientId }: DailyWorkoutProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [workoutHtml, setWorkoutHtml] = useState<string | null>(null)
  const [todayWorkout, setTodayWorkout] = useState<any | null>(null)
  const [existingLog, setExistingLog] = useState<any | null>(null)
  const supabase = createClientComponentClient()

  // Get the current date
  const currentDate = new Date()

  // Format the current date as "YYYY-MM-DD"
  const formattedDate = currentDate.toISOString().split("T")[0]

  // Format the current date as "Monday, April 8, 2025"
  const formattedDateLong = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Generate day ID for database queries
  const dayId = `day-${formattedDate}`

  useEffect(() => {
    async function fetchWorkoutData() {
      setLoading(true)
      setError(null)

      try {
        // Fetch workout HTML
        const { data: workoutData, error: workoutError } = await supabase
          .from("client_workouts")
          .select("workout_html")
          .eq("client_id", clientId)
          .single()

        if (workoutError) {
          console.error("Error fetching workout data:", workoutError)
          throw new Error("Failed to load workout data")
        }

        if (workoutData?.workout_html) {
          setWorkoutHtml(workoutData.workout_html)

          // Parse workout HTML to extract today's workout
          const parser = new DOMParser()
          const doc = parser.parseFromString(workoutData.workout_html, "text/html")

          // Find all h3 elements that might contain day information
          const dayElements = doc.querySelectorAll("h3, h2, h4")
          let todaySection = null

          // Look for Day 7 or 2025-04-07 in the headings
          for (const element of dayElements) {
            const text = element.textContent || ""
            if (text.includes(formattedDate) || text.includes(formattedDateLong)) {
              // Found the target day
              const dayContent = element.nextElementSibling

              // Extract all content until the next h3
              let contentHtml = ""
              let currentNode = element.nextElementSibling

              while (currentNode && !currentNode.tagName.match(/^H[2-4]$/)) {
                contentHtml += currentNode.outerHTML
                currentNode = currentNode.nextElementSibling
              }

              todaySection = {
                title: text.trim(),
                content: contentHtml,
                exercises: [],
              }

              // Parse exercises from the content
              const { exercises } = parseWorkoutHtml(contentHtml)
              todaySection.exercises = exercises

              break
            }
          }

          setTodayWorkout(todaySection)
        }

        // Check if workout is already completed
        const { data: completionData } = await supabase
          .from("workout_completions")
          .select("completed_at")
          .eq("client_id", clientId)
          .eq("day_id", dayId)
          .single()

        setCompleted(!!completionData)

        // Fetch existing log
        const { data: logData } = await supabase
          .from("simple_workout_logs")
          .select("*")
          .eq("client_id", clientId)
          .eq("day_id", dayId)
          .single()

        if (logData) {
          setExistingLog(logData)
          setNotes(logData.notes || "")
        }
      } catch (err: any) {
        console.error("Error in fetchWorkoutData:", err)
        setError(err.message || "Failed to load workout data")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkoutData()
  }, [clientId, supabase, dayId, formattedDate, formattedDateLong])

  // Save workout log
  const saveWorkoutLog = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Prepare log data
      const logData = {
        client_id: clientId,
        day_id: dayId,
        notes: notes,
        logged_at: new Date().toISOString(),
      }

      // Check if log exists
      if (existingLog) {
        // Update existing log
        const { error: updateError } = await supabase
          .from("simple_workout_logs")
          .update({
            notes: notes,
            logged_at: new Date().toISOString(),
          })
          .eq("id", existingLog.id)

        if (updateError) throw new Error("Failed to update workout log")
      } else {
        // Insert new log
        const { error: insertError } = await supabase.from("simple_workout_logs").insert(logData)

        if (insertError) throw new Error("Failed to save workout log")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)

      // Log this activity
      const workoutName = todayWorkout?.title || "Today's Workout"
      await logActivity(clientId, "workout", `Logged ${workoutName}`, notes || "Completed workout", { dayId })
    } catch (err: any) {
      console.error("Error saving workout log:", err)
      setError(err.message || "Failed to save workout log")
    } finally {
      setSaving(false)
    }
  }

  // Toggle workout completion
  const toggleWorkoutCompletion = async () => {
    try {
      if (completed) {
        // Delete completion record
        await supabase.from("workout_completions").delete().eq("client_id", clientId).eq("day_id", dayId)

        setCompleted(false)
      } else {
        // Add completion record
        await supabase.from("workout_completions").insert({
          client_id: clientId,
          day_id: dayId,
          completed_at: new Date().toISOString(),
        })

        setCompleted(true)
      }
    } catch (err: any) {
      console.error("Error toggling workout completion:", err)
      setError("Failed to update workout status")
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <Dumbbell className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-xl font-medium text-gray-300">Loading workout data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{formattedDateLong}</h3>
        <Button
          onClick={toggleWorkoutCompletion}
          className={`px-6 py-2 text-base font-medium rounded-lg transition-colors ${
            completed ? "bg-green-700 hover:bg-green-800" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {completed ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Completed
            </>
          ) : (
            "Mark as Completed"
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-800 bg-red-900/20 text-red-300">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      )}

      {todayWorkout ? (
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="font-medium text-lg mb-3">Today's Workout</h4>
          <div
            className="workout-plan-html bg-gray-700 p-4 rounded-lg shadow-md text-white"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(todayWorkout.content) }}
          />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">No workout plan found for today.</p>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Track Your Progress</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notes" className="text-gray-200 mb-2 block text-lg font-medium">
              Did you deviate from the plan? (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Note any modifications or changes you made to the workout (leave blank if you followed the plan exactly)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="bg-gray-700 border-gray-600 text-white resize-none text-base p-4 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={saveWorkoutLog}
              disabled={saving}
              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800"
            >
              {saving ? (
                <>Saving...</>
              ) : success ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Log
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
