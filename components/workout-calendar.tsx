"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, ChevronDown, ChevronUp, Clock } from "lucide-react"

type Exercise = {
  section: string
  description: string
  isList?: boolean
  details?: string[]
  duration?: number // in minutes
}

type Workout = {
  id: number
  day: number
  date: string
  dayOfWeek: string
  title: string
  focus: string
  exercises: Exercise[]
  exerciseCount: number
  isRestDay?: boolean
  startTime?: string
  endTime?: string
}

type WorkoutCalendarProps = {
  clientId: number
  workouts: Workout[]
  defaultStartTime: string
  timezone: string
}

export function WorkoutCalendar({ clientId, workouts, defaultStartTime, timezone }: WorkoutCalendarProps) {
  // Get current date and format it
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Find today's workout (April 2, 2025)
  const todayIndex = workouts.findIndex((workout) => workout.date === "2025-04-02")
  const [currentIndex, setCurrentIndex] = useState(todayIndex !== -1 ? todayIndex : 0)
  const [showTimeline, setShowTimeline] = useState(false)

  const currentWorkout = workouts[currentIndex]
  const timelineRef = useRef<HTMLDivElement>(null)

  // Scroll the timeline to center the current day when it changes
  useEffect(() => {
    if (timelineRef.current && showTimeline) {
      const selectedDay = timelineRef.current.querySelector(`[data-index="${currentIndex}"]`)
      if (selectedDay) {
        const container = timelineRef.current
        const scrollLeft =
          selectedDay.getBoundingClientRect().left -
          container.getBoundingClientRect().left -
          container.clientWidth / 2 +
          selectedDay.getBoundingClientRect().width / 2

        container.scrollTo({
          left: container.scrollLeft + scrollLeft,
          behavior: "smooth",
        })
      }
    }
  }, [currentIndex, showTimeline])

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < workouts.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToToday = () => {
    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex)
    }
  }

  const goToDay = (index: number) => {
    setCurrentIndex(index)
  }

  // Get previous workouts (excluding the current one)
  const previousWorkouts = workouts
    .filter((_, index) => index !== currentIndex)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  // Format date as YYYY-MM-DD for datetime attribute
  const formatDateForAttribute = (dateString: string) => {
    return dateString
  }

  // Format date for display (e.g., "April 2, 2025")
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <div className="bg-gray-800 p-4 mb-4 rounded-lg border border-gray-700 shadow-md">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-green-500" />
          Today: {formattedDate}
        </h2>
      </div>
      {/* Header with navigation */}
      <div className="bg-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <Calendar className="h-6 w-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">
                  Day {currentWorkout.day}:{" "}
                  <time dateTime={formatDateForAttribute(currentWorkout.date)}>
                    {formatDateForDisplay(currentWorkout.date)}
                  </time>{" "}
                  ({currentWorkout.dayOfWeek})
                </h2>
                <p className="text-purple-200 text-sm">Today's Workout</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToToday}
                className="bg-white text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-purple-50 transition-colors"
              >
                Today
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === workouts.length - 1}
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                aria-label="Next day"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="flex items-center text-sm text-purple-200 hover:text-white transition-colors"
            >
              {showTimeline ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Plan Timeline
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show Plan Timeline
                </>
              )}
            </button>
          </div>

          {/* Timeline view */}
          {showTimeline && (
            <div
              ref={timelineRef}
              className="mt-3 overflow-x-auto pb-2 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="flex space-x-2 min-w-max px-2">
                {workouts.map((workout, index) => (
                  <button
                    key={workout.id}
                    data-index={index}
                    onClick={() => goToDay(index)}
                    className={`flex-shrink-0 px-3 py-2 rounded-md transition-colors ${
                      index === currentIndex
                        ? "bg-white text-purple-700 font-medium"
                        : "bg-purple-800/50 hover:bg-purple-800 text-white"
                    }`}
                  >
                    <div className="text-xs font-medium">Day {workout.day}</div>
                    <div className="text-xs">{workout.date.split("-")[2]}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workout content */}
      <div className="max-w-5xl mx-auto px-4 py-6 bg-gray-950">
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{currentWorkout.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{currentWorkout.focus}</p>
              </div>
              {!currentWorkout.isRestDay && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>

          <div className="p-5">
            {currentWorkout.isRestDay ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-xl">No training</p>
              </div>
            ) : (
              <>
                {/* Time information */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <Clock className="h-5 w-5 mr-2 text-purple-400" />
                    <div>
                      <p className="text-white">Start Time: {currentWorkout.startTime}</p>
                      <p className="text-white">End Time: {currentWorkout.endTime}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <p>Timezone: {timezone}</p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                  <div className="w-full lg:w-2/3 pr-0 lg:pr-6 mb-6 lg:mb-0">
                    <div className="bg-gray-800 text-white p-6 rounded-lg">
                      {/* Warm-up Section */}
                      {currentWorkout.exercises.some((ex) => ex.section.includes("Warm-up")) && (
                        <div className="mb-6">
                          {currentWorkout.exercises
                            .filter((ex) => ex.section.includes("Warm-up"))
                            .map((exercise, idx) => (
                              <div key={idx}>
                                <p className="mb-2">
                                  <span className="text-yellow-400 font-medium">{exercise.section}:</span>
                                  {!exercise.isList && <span> {exercise.description}</span>}
                                </p>

                                {exercise.isList && exercise.details && (
                                  <ul className="list-disc pl-8 mt-2 text-white">
                                    {exercise.details.map((detail, detailIdx) => (
                                      <li key={detailIdx}>{detail}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Main Section */}
                      {currentWorkout.exercises.some((ex) => ex.section.includes("Main")) && (
                        <div className="mb-6">
                          {currentWorkout.exercises
                            .filter((ex) => ex.section.includes("Main"))
                            .map((exercise, idx) => (
                              <div key={idx}>
                                <p className="mb-2">
                                  <span className="text-yellow-400 font-medium">{exercise.section}:</span>
                                  {!exercise.isList && <span> {exercise.description}</span>}
                                </p>

                                {exercise.isList && exercise.details && (
                                  <ul className="list-disc pl-8 mt-2 text-white">
                                    {exercise.details.map((detail, detailIdx) => (
                                      <li key={detailIdx}>{detail}</li>
                                    ))}
                                  </ul>
                                )}

                                {exercise.isList && !exercise.details && (
                                  <ul className="list-disc pl-8 mt-2 text-white">
                                    <li>{exercise.description}</li>
                                  </ul>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Aux Section */}
                      {currentWorkout.exercises.some((ex) => ex.section.includes("Aux")) && (
                        <div className="mb-6">
                          {currentWorkout.exercises
                            .filter((ex) => ex.section.includes("Aux"))
                            .map((exercise, idx) => (
                              <div key={idx}>
                                <p className="mb-2">
                                  <span className="text-yellow-400 font-medium">{exercise.section}:</span>
                                  {!exercise.isList && <span> {exercise.description}</span>}
                                </p>

                                {exercise.isList && exercise.details && (
                                  <ul className="list-disc pl-8 mt-2 text-white">
                                    {exercise.details.map((detail, detailIdx) => (
                                      <li key={detailIdx}>{detail}</li>
                                    ))}
                                  </ul>
                                )}

                                {exercise.isList && !exercise.details && (
                                  <ul className="list-disc pl-8 mt-2 text-white">
                                    <li>{exercise.description}</li>
                                  </ul>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Cool-down Section */}
                      {currentWorkout.exercises.some((ex) => ex.section.includes("Cool-down")) && (
                        <div>
                          {currentWorkout.exercises
                            .filter((ex) => ex.section.includes("Cool-down"))
                            .map((exercise, idx) => (
                              <div key={idx}>
                                <p className="mb-2">
                                  <span className="text-yellow-400 font-medium">{exercise.section}:</span>
                                  {!exercise.isList && <span> {exercise.description}</span>}
                                </p>

                                {exercise.isList && exercise.details && (
                                  <ul className="list-disc pl-8 mt-2 text-white">
                                    {exercise.details.map((detail, detailIdx) => (
                                      <li key={detailIdx}>{detail}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-1/3">
                    <div className="bg-gray-800 text-white p-6 rounded-lg h-full">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2">{currentWorkout.exerciseCount} exercises</h3>
                      </div>
                      <div className="bg-gray-700 p-4 rounded text-center text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors">
                        Click here to record any deviations from the plan.
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Previous workouts */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4 text-white">Previous Workouts</h2>

          <div className="space-y-4">
            {previousWorkouts.map((workout) => (
              <div key={workout.id} className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-white">
                      Day {workout.day}:{" "}
                      <time dateTime={formatDateForAttribute(workout.date)}>{formatDateForDisplay(workout.date)}</time>{" "}
                      ({workout.dayOfWeek}) - {workout.title}
                    </h3>
                    {!workout.isRestDay && workout.startTime && (
                      <p className="text-sm text-gray-400">
                        {workout.startTime} - {workout.endTime}
                      </p>
                    )}
                    {workout.isRestDay && <p className="text-sm text-gray-400">No training</p>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-white hover:bg-gray-800"
                    onClick={() => goToDay(workouts.findIndex((w) => w.id === workout.id))}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
