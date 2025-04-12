"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveWorkoutQuestionnaire } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Client = {
  id: number
  name: string
}

export default function WorkoutQuestionnaireForm({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    primaryGoal: "",
    eventDeadline: "",
    secondaryGoals: "",
    fitnessLevel: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClientId) {
      setMessage({ type: "error", text: "Please select a client" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await saveWorkoutQuestionnaire({
        client_id: selectedClientId,
        workout_data: formData,
      })

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Optionally reset form or redirect
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === "success" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="clientSelect" className="text-white">
            Client Name
          </Label>
          <Select onValueChange={(value) => setSelectedClientId(Number(value))} required>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryGoal" className="text-white">
            Primary Fitness Goal
          </Label>
          <Textarea
            id="primaryGoal"
            name="primaryGoal"
            value={formData.primaryGoal}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What is your main fitness goal?"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDeadline" className="text-white">
            Specific Event or Deadline
          </Label>
          <Input
            id="eventDeadline"
            name="eventDeadline"
            type="date"
            value={formData.eventDeadline}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryGoals" className="text-white">
            Secondary Goals
          </Label>
          <Textarea
            id="secondaryGoals"
            name="secondaryGoals"
            value={formData.secondaryGoals}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Any additional fitness goals?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fitnessLevel" className="text-white">
            Current Fitness Level
          </Label>
          <Select onValueChange={(value) => handleSelectChange("fitnessLevel", value)} required>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select fitness level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="trainingExperience" className="text-white">
            Training Experience
          </Label>
          <Textarea
            id="trainingExperience"
            name="trainingExperience"
            value={formData.trainingExperience}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Describe your training history and experience"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentStats" className="text-white">
            Current Stats or Benchmarks
          </Label>
          <Textarea
            id="currentStats"
            name="currentStats"
            value={formData.currentStats}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Current performance metrics (e.g., max lifts, run times)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyComposition" className="text-white">
            Current Body Composition or Weight
          </Label>
          <Textarea
            id="bodyComposition"
            name="bodyComposition"
            value={formData.bodyComposition}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Current weight, body fat %, measurements, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredTrainingStyle" className="text-white">
            Preferred Training Method or Style
          </Label>
          <Textarea
            id="preferredTrainingStyle"
            name="preferredTrainingStyle"
            value={formData.preferredTrainingStyle}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What types of training do you enjoy? (e.g., HIIT, strength training, etc.)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trainingDaysPerWeek" className="text-white">
            Training Days per Week
          </Label>
          <Input
            id="trainingDaysPerWeek"
            name="trainingDaysPerWeek"
            value={formData.trainingDaysPerWeek}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="How many days per week can you train?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workoutDuration" className="text-white">
            Ideal Workout Duration
          </Label>
          <Input
            id="workoutDuration"
            name="workoutDuration"
            value={formData.workoutDuration}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="How long can you spend on each workout?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialSkills" className="text-white">
            Special Skills or Focus Exercises
          </Label>
          <Textarea
            id="specialSkills"
            name="specialSkills"
            value={formData.specialSkills}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Any specific exercises or skills you want to focus on?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="injuries" className="text-white">
            Injuries or Physical Limitations
          </Label>
          <Textarea
            id="injuries"
            name="injuries"
            value={formData.injuries}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Any injuries or physical limitations to be aware of?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exercisesCannotPerform" className="text-white">
            Exercises You Cannot Perform
          </Label>
          <Textarea
            id="exercisesCannotPerform"
            name="exercisesCannotPerform"
            value={formData.exercisesCannotPerform}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="List any exercises you cannot or prefer not to do"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipmentAccess" className="text-white">
            Equipment Access
          </Label>
          <Textarea
            id="equipmentAccess"
            name="equipmentAccess"
            value={formData.equipmentAccess}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What equipment do you have access to? (gym, home equipment, etc.)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeConstraints" className="text-white">
            Time Constraints or Scheduling Preferences
          </Label>
          <Textarea
            id="timeConstraints"
            name="timeConstraints"
            value={formData.timeConstraints}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Any specific time constraints or preferred workout times?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mainMotivation" className="text-white">
            Main Motivation
          </Label>
          <Textarea
            id="mainMotivation"
            name="mainMotivation"
            value={formData.mainMotivation}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What motivates you to achieve your fitness goals?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="challenges" className="text-white">
            Challenges in Sticking to a Plan
          </Label>
          <Textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What challenges do you face in sticking to a workout plan?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="progressTrackingMethod" className="text-white">
            Preferred Progress Tracking Method
          </Label>
          <Textarea
            id="progressTrackingMethod"
            name="progressTrackingMethod"
            value={formData.progressTrackingMethod}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="How do you prefer to track your progress?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-white">
            Start Date
          </Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultWorkoutTime" className="text-white">
            Default Workout Start Time
          </Label>
          <Input
            id="defaultWorkoutTime"
            name="defaultWorkoutTime"
            type="time"
            value={formData.defaultWorkoutTime}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone" className="text-white">
            Timezone
          </Label>
          <Input
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Your timezone (e.g., EST, PST, etc.)"
          />
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Workout Questionnaire"}
        </Button>
      </form>
    </div>
  )
}
