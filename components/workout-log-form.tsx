"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, Save, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { logActivity } from "@/app/actions/log-activity"

interface Exercise {
  name: string
  type: "strength" | "cardio" | "other"
  sets?: number
  reps?: string
  weight?: string
  duration?: string
  distance?: string
  pace?: string
  zone?: string
}

interface WorkoutLogFormProps {
  clientId: number
  dayId: string
  dayTitle: string
  exercises: Exercise[]
  onSaved: () => void
}

export function WorkoutLogForm({ clientId, dayId, dayTitle, exercises, onSaved }: WorkoutLogFormProps) {
  const [logs, setLogs] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClientComponentClient()

  // Fetch existing logs for this workout
  const fetchLogs = async () => {
    setLoading(true)
    try {
      // First check if the workout_logs table exists
      try {
        const { data, error } = await supabase
          .from("workout_logs")
          .select("*")
          .eq("client_id", clientId)
          .eq("day_id", dayId)

        if (error) {
          if (error.message.includes("does not exist")) {
            // Table doesn't exist yet, try to create it
            await fetch("/api/setup-database")
            setLogs({})
          } else if (error.message.includes('column "day_id" does not exist')) {
            // The day_id column is missing, we need to recreate the table
            await fetch("/api/setup-database")
            setLogs({})
          } else {
            console.error("Error fetching workout logs:", error)
            setError(error.message)
          }
        } else {
          // Convert array of logs to object keyed by exercise name
          const logsObj: Record<string, any> = {}
          data?.forEach((log) => {
            logsObj[log.exercise_name] = log
          })
          setLogs(logsObj)
        }
      } catch (err: any) {
        console.error("Error checking workout_logs table:", err)
        setError("Error checking workout logs table: " + err.message)
      }
    } catch (error: any) {
      console.error("Error in fetchLogs:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [clientId, dayId, supabase])

  // Handle input change
  const handleInputChange = (exerciseName: string, field: string, value: string | number) => {
    setLogs((prevLogs) => ({
      ...prevLogs,
      [exerciseName]: {
        ...(prevLogs[exerciseName] || {}),
        [field]: value,
      },
    }))
  }

  // Save logs to database
  const saveWorkoutLogs = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Prepare logs for saving
      const logsToSave = Object.entries(logs).map(([exerciseName, log]) => {
        const exercise = exercises.find((e) => e.name === exerciseName)

        return {
          client_id: clientId,
          day_id: dayId,
          exercise_name: exerciseName,
          // Strength fields
          planned_sets: exercise?.sets || null,
          actual_sets: log.actual_sets || null,
          planned_reps: exercise?.reps || null,
          actual_reps: log.actual_reps || null,
          planned_weight: exercise?.weight || null,
          actual_weight: log.actual_weight || null,
          // Cardio fields
          planned_duration: exercise?.duration || null,
          actual_duration: log.actual_duration || null,
          planned_distance: exercise?.distance || null,
          actual_distance: log.actual_distance || null,
          planned_pace: exercise?.pace || null,
          actual_pace: log.actual_pace || null,
          planned_zone: exercise?.zone || null,
          actual_zone: log.actual_zone || null,
          // Notes
          notes: log.notes || null,
        }
      })

      // Use upsert to handle both insert and update
      const { error } = await supabase.from("workout_logs").upsert(logsToSave, {
        onConflict: "client_id,day_id,exercise_name",
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onSaved()
      }, 1500)

      // Log this activity
      const workoutName = dayTitle
      const notes = Object.values(logs)
        .map((log: any) => log.notes)
        .filter((note) => note)
        .join(", ")
      const exerciseData = exercises.map((exercise) => exercise.name)
      await logActivity(
        clientId,
        "workout",
        `Completed ${workoutName || "workout"}`,
        notes || `Completed all exercises for ${dayId.replace("day-", "")}`,
        { dayId, exercises: exerciseData },
      )
    } catch (err: any) {
      console.error("Error saving workout logs:", err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-300">Loading workout data...</div>
  }

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{dayTitle}</h3>
        <Button
          onClick={saveWorkoutLogs}
          disabled={saving}
          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800"
        >
          {saving ? (
            <>Saving...</>
          ) : success ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Log
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-800 bg-red-900/20 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {exercises.map((exercise) => (
          <div key={exercise.name} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
            <h4 className="font-medium text-lg mb-3">{exercise.name}</h4>

            {exercise.type === "strength" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1 block text-gray-300">Sets</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-900 px-3 py-2 rounded text-purple-400 text-sm flex-1">
                      Planned: {exercise.sets || "N/A"}
                    </div>
                    <Input
                      type="number"
                      placeholder="Actual sets"
                      value={logs[exercise.name]?.actual_sets || ""}
                      onChange={(e) => handleInputChange(exercise.name, "actual_sets", e.target.value)}
                      className="flex-1 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block text-gray-300">Reps</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-900 px-3 py-2 rounded text-purple-400 text-sm flex-1">
                      Planned: {exercise.reps || "N/A"}
                    </div>
                    <Input
                      placeholder="Actual reps"
                      value={logs[exercise.name]?.actual_reps || ""}
                      onChange={(e) => handleInputChange(exercise.name, "actual_reps", e.target.value)}
                      className="flex-1 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block text-gray-300">Weight</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-900 px-3 py-2 rounded text-purple-400 text-sm flex-1">
                      Planned: {exercise.weight || "N/A"}
                    </div>
                    <Input
                      placeholder="Actual weight"
                      value={logs[exercise.name]?.actual_weight || ""}
                      onChange={(e) => handleInputChange(exercise.name, "actual_weight", e.target.value)}
                      className="flex-1 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {exercise.type === "cardio" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block text-gray-300">Duration</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-900 px-3 py-2 rounded text-purple-400 text-sm flex-1">
                      Planned: {exercise.duration || "N/A"}
                    </div>
                    <Input
                      placeholder="Actual duration"
                      value={logs[exercise.name]?.actual_duration || ""}
                      onChange={(e) => handleInputChange(exercise.name, "actual_duration", e.target.value)}
                      className="flex-1 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block text-gray-300">Distance</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-900 px-3 py-2 rounded text-purple-400 text-sm flex-1">
                      Planned: {exercise.distance || "N/A"}
                    </div>
                    <Input
                      placeholder="Actual distance"
                      value={logs[exercise.name]?.actual_distance || ""}
                      onChange={(e) => handleInputChange(exercise.name, "actual_distance", e.target.value)}
                      className="flex-1 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block text-gray-300">Pace</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-900 px-3 py-2 rounded text-purple-400 text-sm flex-1">
                      Planned: {exercise.pace || "N/A"}
                    </div>
                    <Input
                      placeholder="Actual pace"
                      value={logs[exercise.name]?.actual_pace || ""}
                      onChange={(e) => handleInputChange(exercise.name, "actual_pace", e.target.value)}
                      className="flex-1 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block text-gray-300">Zone</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-900 px-3 py-2 rounded text-purple-400 text-sm flex-1">
                      Planned: {exercise.zone || "N/A"}
                    </div>
                    <Input
                      placeholder="Actual zone"
                      value={logs[exercise.name]?.actual_zone || ""}
                      onChange={(e) => handleInputChange(exercise.name, "actual_zone", e.target.value)}
                      className="flex-1 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <Label className="mb-1 block text-gray-300">Notes</Label>
              <Textarea
                placeholder="Add notes about this exercise (e.g., felt too easy, too hard, modifications made)"
                value={logs[exercise.name]?.notes || ""}
                onChange={(e) => handleInputChange(exercise.name, "notes", e.target.value)}
                rows={2}
                className="bg-gray-900 border-gray-700 text-gray-100"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={saveWorkoutLogs}
          disabled={saving}
          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800"
        >
          {saving ? (
            <>Saving...</>
          ) : success ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Log
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
