"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import DOMPurify from "dompurify"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, FileDown, AlertCircle, Dumbbell, Flame } from "lucide-react"
import { parseWorkoutHtml } from "@/components/workout-parser"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SimpleWorkoutLogForm } from "@/components/simple-workout-log-form"
import { PhaseTargets } from "@/components/PhaseTargets"

interface WorkoutDisplayProps {
  clientId: number
  workoutHtml?: string
}

// Helper function to extract dates from various formats
const extractDateFromDayTitle = (dayTitle: string): string | null => {
  // Try to extract a date in YYYY-MM-DD format
  const isoDateMatch = dayTitle.match(/(\d{4}-\d{2}-\d{2})/)
  if (isoDateMatch && isoDateMatch[1]) {
    return isoDateMatch[1]
  }

  // Try to extract a date in Month Day, Year format
  const monthDateMatch = dayTitle.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i,
  )
  if (monthDateMatch) {
    const month = new Date(`${monthDateMatch[1]} 1, 2000`).getMonth() + 1
    const day = Number.parseInt(monthDateMatch[2])
    const year = Number.parseInt(monthDateMatch[3])
    const formattedMonth = month.toString().padStart(2, "0")
    const formattedDay = day.toString().padStart(2, "0")
    return `${year}-${formattedMonth}-${formattedDay}`
  }

  // Try to extract a date in MM/DD/YYYY format
  const slashDateMatch = dayTitle.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (slashDateMatch) {
    const month = Number.parseInt(slashDateMatch[1]).toString().padStart(2, "0")
    const day = Number.parseInt(slashDateMatch[2]).toString().padStart(2, "0")
    const year = slashDateMatch[3]
    return `${year}-${month}-${day}`
  }

  // No date found
  return null
}

// Dummy function for generateGrokReport
const generateGrokReport = () => {
  alert("Export Report functionality is not yet implemented.")
}

export function WorkoutDisplay({ clientId, workoutHtml }: WorkoutDisplayProps) {
  const [html, setHtml] = useState<string>(workoutHtml || "")
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [workoutDays, setWorkoutDays] = useState<any[]>([])
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<any>(null)
  const [showLogForm, setShowLogForm] = useState(false)
  const [workoutLogs, setWorkoutLogs] = useState<Record<string, any>>({})
  const [error, setError] = useState<string | null>(null)
  const [workoutStreak, setWorkoutStreak] = useState(0)
  const supabase = createClientComponentClient()

  // Define phase targets
  const phaseTargets = [
    { name: "Squat", value: "310", unit: "lbs" },
    { name: "2-Mile Run", value: "14:30", unit: "min" },
    { name: "Ruck Pace", value: "15", unit: "min/mile" },
  ]

  // Parse workout HTML to extract days
  useEffect(() => {
    if (html) {
      try {
        // Extract day sections from HTML
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")

        // Find all h3 elements that contain day information
        const dayElements = doc.querySelectorAll("h3")
        const days: any[] = []

        dayElements.forEach((element, index) => {
          // Check if this is a day heading (contains "Day" and a number)
          if (element.textContent && element.textContent.includes("Day")) {
            const dayContent = element.nextElementSibling
            const dayTitle = element.textContent.trim()

            // Extract date from the heading if available
            let dayId = `day-${index + 1}` // Default fallback

            const extractedDate = extractDateFromDayTitle(dayTitle)
            if (extractedDate) {
              dayId = `day-${extractedDate}`
            }

            // Try to parse exercises from the content
            const contentHtml = dayContent ? dayContent.outerHTML : ""
            const { exercises } = parseWorkoutHtml(contentHtml)

            // Create a day object with the heading and content
            days.push({
              id: dayId,
              title: dayTitle,
              content: contentHtml,
              dayNumber: index + 1,
              exercises: exercises,
            })
          }
        })

        setWorkoutDays(days)
      } catch (err) {
        console.error("Error parsing workout HTML:", err)
      }
    }
  }, [html])

  // Fetch workout data and completion status
  useEffect(() => {
    const fetchWorkoutData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch workout HTML if not provided
        if (!workoutHtml) {
          try {
            const { data: workoutData, error } = await supabase
              .from("client_workouts")
              .select("workout_html")
              .eq("client_id", clientId)
              .single()

            if (!error && workoutData?.workout_html) {
              setHtml(workoutData.workout_html)
            }
          } catch (err) {
            // Silently fail - we'll just use an empty workout plan
            console.log("No existing workout plan found")
          }
        }

        // Tables have been created via SQL, so we don't need to create them here
        console.log("Using existing workout tables")

        // Fetch completed workouts - simple approach
        try {
          const { data: completionData } = await supabase
            .from("workout_completions")
            .select("day_id, completed_at")
            .eq("client_id", clientId)

          if (completionData) {
            const completions: Record<string, boolean> = {}
            completionData.forEach((item) => {
              completions[item.day_id] = true
            })
            setCompletedWorkouts(completions)
          }
        } catch (err) {
          console.log("No workout completions found")
        }

        // Fetch workout logs - simple approach
        try {
          const { data: logsData } = await supabase.from("simple_workout_logs").select("*").eq("client_id", clientId)

          if (logsData) {
            // Organize logs by day_id
            const logs: Record<string, any> = {}
            logsData.forEach((log) => {
              logs[log.day_id] = log
            })
            setWorkoutLogs(logs)
          }
        } catch (err) {
          console.log("No workout logs found")
        }

        // Fetch client's workout streak
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("workout_streak")
          .eq("id", clientId)
          .single()

        if (clientError) {
          console.error("Error fetching client data:", clientError)
        } else if (clientData) {
          setWorkoutStreak(clientData.workout_streak || 0)
        }
      } catch (err: any) {
        console.error("Error fetching workout data:", err)
        setError("Failed to load workout data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkoutData()
  }, [clientId, workoutHtml, supabase])

  // Save workout HTML to database
  const saveWorkoutHtml = async () => {
    if (!html) return

    try {
      // Upsert approach - simpler than checking first
      const { error } = await supabase.from("client_workouts").upsert(
        {
          client_id: clientId,
          workout_html: html,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "client_id",
        },
      )

      if (error) throw error

      alert("Workout plan saved successfully!")
    } catch (error: any) {
      console.error("Error saving workout:", error)
      setError(`Failed to save workout plan: ${error.message || "Unknown error"}`)
    }
  }

  // Toggle workout completion status
  const toggleWorkoutCompletion = async (dayId: string) => {
    try {
      if (completedWorkouts[dayId]) {
        // Delete completion record
        await supabase.from("workout_completions").delete().eq("client_id", clientId).eq("day_id", dayId)

        setCompletedWorkouts((prev) => {
          const updated = { ...prev }
          delete updated[dayId]
          return updated
        })

        // Decrement workout streak
        await supabase
          .from("clients")
          .update({ workout_streak: Math.max(0, workoutStreak - 1) })
          .eq("id", clientId)
        setWorkoutStreak(Math.max(0, workoutStreak - 1))
      } else {
        // Add completion record
        await supabase.from("workout_completions").insert({
          client_id: clientId,
          day_id: dayId,
          completed_at: new Date().toISOString(),
        })

        setCompletedWorkouts((prev) => ({
          ...prev,
          [dayId]: true,
        }))

        // Increment workout streak
        await supabase
          .from("clients")
          .update({ workout_streak: workoutStreak + 1 })
          .eq("id", clientId)
        setWorkoutStreak(workoutStreak + 1)
      }
    } catch (error: any) {
      console.error("Error toggling workout completion:", error)
      setError("Failed to update workout status")
    }
  }

  // Handle HTML input change
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtml(e.target.value)
  }

  // Open log form for a specific day
  const openLogForm = (day: any) => {
    setSelectedDay(day)
    setShowLogForm(true)
  }

  // Handle log form close and refresh data
  const handleLogFormClose = () => {
    setShowLogForm(false)
    setActiveTab("daily") // Ensure we return to the daily tab
    // Refresh workout logs
    supabase
      .from("simple_workout_logs")
      .select("*")
      .eq("client_id", clientId)
      .then(({ data }) => {
        if (data) {
          const logs: Record<string, any> = {}
          data.forEach((log) => {
            logs[log.day_id] = log
          })
          setWorkoutLogs(logs)
        }
      })
  }

  const todayWorkout = workoutDays.length > 0 ? workoutDays[0] : null

  return (
    <div className="bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-700">
      <div className="border-b border-gray-700 bg-gray-800 px-4 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Dumbbell className="h-6 w-6 mr-2" />
          Workout Plan
        </h2>
        <div className="flex space-x-3">
          {!html && (
            <Button
              onClick={() => setActiveTab("input")}
              variant="outline"
              size="default"
              className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
            >
              Add Workout Plan
            </Button>
          )}
          {html && (
            <>
              <Button
                onClick={saveWorkoutHtml}
                variant="outline"
                size="default"
                className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
              >
                Save Changes
              </Button>
              <Button
                onClick={generateGrokReport}
                variant="outline"
                size="default"
                className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600 flex items-center gap-2"
              >
                <FileDown className="h-5 w-5" />
                Export Report
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-3 w-full bg-gray-800">
            <TabsTrigger
              value="overview"
              className="text-base py-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="daily"
              className="text-base py-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              Daily Workouts
            </TabsTrigger>
            <TabsTrigger
              value="input"
              className="text-base py-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              Edit Plan
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-4">
          {html ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-yellow-400" />
                  <h3 className="text-lg font-medium text-white">Workout Streak: {workoutStreak} days</h3>
                </div>
                <div className="text-sm text-gray-400 italic">Keep up the momentum!</div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Progress</h3>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: "60%" }} // Replace with actual progress calculation
                  ></div>
                </div>
                <div className="text-sm text-gray-400 mt-2">60% to event (Marathon)</div>
              </div>

              <PhaseTargets targets={phaseTargets} />

              <div
                className="workout-plan-html bg-gray-800 p-4 rounded-lg shadow-md text-white mt-4"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
              />
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Workout Plan Yet</h3>
              <p className="text-gray-400 mb-4 text-base max-w-md mx-auto">
                Add a workout plan to get started tracking your fitness progress.
              </p>
              <Button
                onClick={() => setActiveTab("input")}
                size="lg"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 text-base font-medium rounded-lg"
              >
                Add Workout Plan
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="daily" className="p-4">
          {workoutDays.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Workout Plan & Tracking</h3>
                <Button
                  onClick={generateGrokReport}
                  size="default"
                  className="bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg"
                >
                  <FileDown className="h-5 w-5" />
                  Export Report
                </Button>
              </div>

              <div className="space-y-4">
                {workoutDays.map((day) => {
                  const log = workoutLogs[day.id]
                  const hasLog = !!log

                  return (
                    <div
                      key={day.id}
                      className={`border rounded-lg overflow-hidden shadow-md ${
                        completedWorkouts[day.id] ? "border-green-600" : "border-gray-700"
                      } bg-gray-800`}
                    >
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-700 text-white border-b border-gray-600">
                        <h3 className="font-bold text-lg text-white">{day.title}</h3>
                        <div className="flex gap-2 items-center">
                          {completedWorkouts[day.id] && (
                            <span className="hidden sm:inline-block text-xs bg-green-800 text-green-200 px-2 py-1 rounded-full font-bold">
                              Completed
                            </span>
                          )}
                          <Button
                            variant={completedWorkouts[day.id] ? "default" : "outline"}
                            size="default"
                            className={
                              completedWorkouts[day.id]
                                ? "bg-green-700 hover:bg-green-800 border-gray-600 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white border-green-500"
                            }
                            onClick={() => toggleWorkoutCompletion(day.id)}
                          >
                            {completedWorkouts[day.id] ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Completed</span>
                              </>
                            ) : (
                              <>Mark Complete</>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="lg:grid lg:grid-cols-2 lg:divide-x lg:divide-gray-700">
                        {/* Left side: Workout Plan */}
                        <div className="p-4 bg-gray-800">
                          <div
                            className="workout-plan-html bg-gray-700 p-4 rounded-lg shadow-md text-white"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(day.content) }}
                          />
                        </div>

                        {/* Right side: Tracking */}
                        <div className="p-4 bg-gray-800 border-t lg:border-t-0 border-gray-700">
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-300 bg-gray-700 px-2 py-1 rounded-md">
                              {day.exercises.length} exercises
                            </span>
                          </div>

                          {hasLog ? (
                            <div className="space-y-3">
                              <div
                                className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-sm cursor-pointer hover:border-gray-500 transition-colors"
                                onClick={() => openLogForm(day)}
                              >
                                {log.notes ? (
                                  <div className="mt-2">
                                    <div className="text-sm text-gray-300 mb-2 font-medium">Deviations from Plan</div>
                                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 text-white text-base">
                                      {log.notes}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-base text-gray-400 text-center py-3">No deviations noted</div>
                                )}

                                <div className="mt-4 flex justify-end">
                                  {!completedWorkouts[day.id] && (
                                    <Button
                                      size="default"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleWorkoutCompletion(day.id)
                                      }}
                                      className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-base font-medium"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Completed
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="text-base bg-gray-700 p-4 rounded-lg border border-gray-600 text-gray-300 font-medium text-center cursor-pointer hover:border-gray-500 transition-colors"
                              onClick={() => openLogForm(day)}
                            >
                              Click here to record any deviations from the plan.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Daily Workouts Found</h3>
              <p className="text-gray-400 text-base">
                Add a workout plan with daily sections to track individual workouts.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="input" className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="workout-html" className="block text-base font-medium text-white mb-2">
                Paste Workout HTML
              </label>
              <textarea
                id="workout-html"
                rows={15}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-base"
                value={html}
                onChange={handleHtmlChange}
                placeholder="Paste the workout HTML here..."
              />
              <p className="mt-2 text-sm text-gray-400">
                Paste the HTML workout plan generated from the AI. The system will automatically parse daily workouts.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setActiveTab("overview")}
                variant="outline"
                size="default"
                className="bg-green-600 text-white hover:bg-green-700 border-green-500"
              >
                Cancel
              </Button>
              <Button
                onClick={saveWorkoutHtml}
                disabled={!html}
                size="default"
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 text-base"
              >
                Save Workout Plan
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Workout Log Dialog */}
      <Dialog open={showLogForm} onOpenChange={setShowLogForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700 text-gray-100 p-4 rounded-lg">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-lg font-bold text-white">{selectedDay?.title}</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="border-red-800 bg-red-900/20 text-red-300 mb-3">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          )}

          {selectedDay && (
            <SimpleWorkoutLogForm
              clientId={clientId}
              dayId={selectedDay.id}
              dayTitle={selectedDay.title}
              existingLog={workoutLogs[selectedDay.id]}
              onSaved={handleLogFormClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
