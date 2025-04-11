"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveWorkoutQuestionnaire } from "./actions"

type Client = {
  id: number
  name: string
}

type WorkoutFormData = {
  clientId: number
  primaryGoal: string
  eventDeadline: string
  secondaryGoals: string
  fitnessLevel: string
  trainingExperience: string
  currentStats: string
  bodyComposition: string
  preferredTrainingStyle: string
  trainingDaysPerWeek: string
  workoutDuration: string
  specialSkills: string
  injuries: string
  exercisesCannotPerform: string
  equipmentAccess: string
  timeConstraints: string
  mainMotivation: string
  challenges: string
  progressTrackingMethod: string
  startDate: string
  defaultWorkoutTime: string
  timezone: string
}

export default function WorkoutQuestionnaireForm({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState<WorkoutFormData>({
    clientId: 0,
    primaryGoal: "",
    eventDeadline: "",
    secondaryGoals: "",
    fitnessLevel: "Beginner",
    trainingExperience: "",
    currentStats: "",
    bodyComposition: "",
    preferredTrainingStyle: "",
    trainingDaysPerWeek: "",
    workoutDuration: "",
    specialSkills: "",
    injuries: "",
    exercisesCannotPerform: "",
    equipmentAccess: "",
    timeConstraints: "",
    mainMotivation: "",
    challenges: "",
    progressTrackingMethod: "",
    startDate: "",
    defaultWorkoutTime: "",
    timezone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      if (!formData.clientId) {
        throw new Error("Please select a client")
      }

      const result = await saveWorkoutQuestionnaire({
        client_id: formData.clientId,
        workout_data: {
          primaryGoal: formData.primaryGoal,
          eventDeadline: formData.eventDeadline,
          secondaryGoals: formData.secondaryGoals,
          fitnessLevel: formData.fitnessLevel,
          trainingExperience: formData.trainingExperience,
          currentStats: formData.currentStats,
          bodyComposition: formData.bodyComposition,
          preferredTrainingStyle: formData.preferredTrainingStyle,
          trainingDaysPerWeek: formData.trainingDaysPerWeek,
          workoutDuration: formData.workoutDuration,
          specialSkills: formData.specialSkills,
          injuries: formData.injuries,
          exercisesCannotPerform: formData.exercisesCannotPerform,
          equipmentAccess: formData.equipmentAccess,
          timeConstraints: formData.timeConstraints,
          mainMotivation: formData.mainMotivation,
          challenges: formData.challenges,
          progressTrackingMethod: formData.progressTrackingMethod,
          startDate: formData.startDate,
          defaultWorkoutTime: formData.defaultWorkoutTime,
          timezone: formData.timezone,
        },
      })

      if (result.success) {
        setMessage({ type: "success", text: "Questionnaire saved successfully!" })
        // Reset form or redirect
        setTimeout(() => {
          router.refresh()
        }, 2000)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Selection */}
        <div className="md:col-span-2">
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
            Client Name *
          </label>
          <select
            id="clientId"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Primary Goal */}
        <div>
          <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700 mb-1">
            Primary Fitness Goal
          </label>
          <input
            type="text"
            id="primaryGoal"
            name="primaryGoal"
            value={formData.primaryGoal}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Event Deadline */}
        <div>
          <label htmlFor="eventDeadline" className="block text-sm font-medium text-gray-700 mb-1">
            Specific Event or Deadline
          </label>
          <input
            type="date"
            id="eventDeadline"
            name="eventDeadline"
            value={formData.eventDeadline}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Secondary Goals */}
        <div>
          <label htmlFor="secondaryGoals" className="block text-sm font-medium text-gray-700 mb-1">
            Secondary Goals
          </label>
          <textarea
            id="secondaryGoals"
            name="secondaryGoals"
            value={formData.secondaryGoals}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Fitness Level */}
        <div>
          <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Current Fitness Level
          </label>
          <select
            id="fitnessLevel"
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Training Experience */}
        <div>
          <label htmlFor="trainingExperience" className="block text-sm font-medium text-gray-700 mb-1">
            Training Experience
          </label>
          <textarea
            id="trainingExperience"
            name="trainingExperience"
            value={formData.trainingExperience}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Current Stats */}
        <div>
          <label htmlFor="currentStats" className="block text-sm font-medium text-gray-700 mb-1">
            Current Stats or Benchmarks
          </label>
          <textarea
            id="currentStats"
            name="currentStats"
            value={formData.currentStats}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Body Composition */}
        <div>
          <label htmlFor="bodyComposition" className="block text-sm font-medium text-gray-700 mb-1">
            Current Body Composition or Weight
          </label>
          <input
            type="text"
            id="bodyComposition"
            name="bodyComposition"
            value={formData.bodyComposition}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Preferred Training Style */}
        <div>
          <label htmlFor="preferredTrainingStyle" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Training Method or Style
          </label>
          <input
            type="text"
            id="preferredTrainingStyle"
            name="preferredTrainingStyle"
            value={formData.preferredTrainingStyle}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Training Days */}
        <div>
          <label htmlFor="trainingDaysPerWeek" className="block text-sm font-medium text-gray-700 mb-1">
            Training Days per Week
          </label>
          <input
            type="text"
            id="trainingDaysPerWeek"
            name="trainingDaysPerWeek"
            value={formData.trainingDaysPerWeek}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Workout Duration */}
        <div>
          <label htmlFor="workoutDuration" className="block text-sm font-medium text-gray-700 mb-1">
            Ideal Workout Duration
          </label>
          <input
            type="text"
            id="workoutDuration"
            name="workoutDuration"
            value={formData.workoutDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Special Skills */}
        <div>
          <label htmlFor="specialSkills" className="block text-sm font-medium text-gray-700 mb-1">
            Special Skills or Focus Exercises
          </label>
          <textarea
            id="specialSkills"
            name="specialSkills"
            value={formData.specialSkills}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Injuries */}
        <div>
          <label htmlFor="injuries" className="block text-sm font-medium text-gray-700 mb-1">
            Injuries or Physical Limitations
          </label>
          <textarea
            id="injuries"
            name="injuries"
            value={formData.injuries}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Exercises Cannot Perform */}
        <div>
          <label htmlFor="exercisesCannotPerform" className="block text-sm font-medium text-gray-700 mb-1">
            Exercises You Cannot Perform
          </label>
          <textarea
            id="exercisesCannotPerform"
            name="exercisesCannotPerform"
            value={formData.exercisesCannotPerform}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Equipment Access */}
        <div>
          <label htmlFor="equipmentAccess" className="block text-sm font-medium text-gray-700 mb-1">
            Equipment Access
          </label>
          <textarea
            id="equipmentAccess"
            name="equipmentAccess"
            value={formData.equipmentAccess}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Time Constraints */}
        <div>
          <label htmlFor="timeConstraints" className="block text-sm font-medium text-gray-700 mb-1">
            Time Constraints or Scheduling Preferences
          </label>
          <textarea
            id="timeConstraints"
            name="timeConstraints"
            value={formData.timeConstraints}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Main Motivation */}
        <div>
          <label htmlFor="mainMotivation" className="block text-sm font-medium text-gray-700 mb-1">
            Main Motivation
          </label>
          <textarea
            id="mainMotivation"
            name="mainMotivation"
            value={formData.mainMotivation}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Challenges */}
        <div>
          <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-1">
            Challenges in Sticking to a Plan
          </label>
          <textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        {/* Progress Tracking Method */}
        <div>
          <label htmlFor="progressTrackingMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Progress Tracking Method
          </label>
          <input
            type="text"
            id="progressTrackingMethod"
            name="progressTrackingMethod"
            value={formData.progressTrackingMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Default Workout Time */}
        <div>
          <label htmlFor="defaultWorkoutTime" className="block text-sm font-medium text-gray-700 mb-1">
            Default Workout Start Time
          </label>
          <input
            type="time"
            id="defaultWorkoutTime"
            name="defaultWorkoutTime"
            value={formData.defaultWorkoutTime}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Timezone */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <input
            type="text"
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Questionnaire"}
        </button>
      </div>
    </form>
  )
}
