"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveWorkoutQuestionnaire } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type Client = {
  id: number
  name: string
}

type WorkoutData = {
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

interface WorkoutQuestionnaireFormProps {
  clients: Client[]
}

export default function WorkoutQuestionnaireForm({ clients }: WorkoutQuestionnaireFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState<WorkoutData>({
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
      const result = await saveWorkoutQuestionnaire({
        client_id: Number(e.currentTarget.closest("form")?.querySelector<HTMLSelectElement>("#clientId")?.value),
        workout_data: formData,
      })

      if (result.success) {
        setMessage({ type: "success", text: "Questionnaire saved successfully!" })
        router.refresh()
      } else {
        setMessage({ type: "error", text: result.message || "An error occurred" })
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <Alert variant={message.type === "success" ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-100">Workout Questionnaire</h2>

        <div>
          <Label htmlFor="clientId" className="block text-sm font-medium text-gray-300 mb-1">
            Client Name *
          </Label>
          <Select
            id="clientId"
            name="clientId"
            onValueChange={(value) => setFormData({ ...formData, clientId: Number(value) })}
            required
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id.toString()}>
                {client.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-300 mb-1">
            Primary Fitness Goal
          </Label>
          <Input
            type="text"
            id="primaryGoal"
            name="primaryGoal"
            value={formData.primaryGoal}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="eventDeadline" className="block text-sm font-medium text-gray-300 mb-1">
            Specific Event or Deadline
          </Label>
          <Input
            type="date"
            id="eventDeadline"
            name="eventDeadline"
            value={formData.eventDeadline}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="secondaryGoals" className="block text-sm font-medium text-gray-300 mb-1">
            Secondary Goals
          </Label>
          <Textarea
            id="secondaryGoals"
            name="secondaryGoals"
            value={formData.secondaryGoals}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-300 mb-1">
            Current Fitness Level
          </Label>
          <Select
            id="fitnessLevel"
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value })}
            className="admin-select"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="trainingExperience" className="block text-sm font-medium text-gray-300 mb-1">
            Training Experience
          </Label>
          <Textarea
            id="trainingExperience"
            name="trainingExperience"
            value={formData.trainingExperience}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="currentStats" className="block text-sm font-medium text-gray-300 mb-1">
            Current Stats or Benchmarks
          </Label>
          <Textarea
            id="currentStats"
            name="currentStats"
            value={formData.currentStats}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="bodyComposition" className="block text-sm font-medium text-gray-300 mb-1">
            Current Body Composition or Weight
          </Label>
          <Input
            type="text"
            id="bodyComposition"
            name="bodyComposition"
            value={formData.bodyComposition}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="preferredTrainingStyle" className="block text-sm font-medium text-gray-300 mb-1">
            Preferred Training Method or Style
          </Label>
          <Input
            type="text"
            id="preferredTrainingStyle"
            name="preferredTrainingStyle"
            value={formData.preferredTrainingStyle}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="trainingDaysPerWeek" className="block text-sm font-medium text-gray-300 mb-1">
            Training Days per Week
          </Label>
          <Input
            type="text"
            id="trainingDaysPerWeek"
            name="trainingDaysPerWeek"
            value={formData.trainingDaysPerWeek}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="workoutDuration" className="block text-sm font-medium text-gray-300 mb-1">
            Ideal Workout Duration
          </Label>
          <Input
            type="text"
            id="workoutDuration"
            name="workoutDuration"
            value={formData.workoutDuration}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="specialSkills" className="block text-sm font-medium text-gray-300 mb-1">
            Special Skills or Focus Exercises
          </Label>
          <Textarea
            id="specialSkills"
            name="specialSkills"
            value={formData.specialSkills}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="injuries" className="block text-sm font-medium text-gray-300 mb-1">
            Injuries or Physical Limitations
          </Label>
          <Textarea
            id="injuries"
            name="injuries"
            value={formData.injuries}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="exercisesCannotPerform" className="block text-sm font-medium text-gray-300 mb-1">
            Exercises You Cannot Perform
          </Label>
          <Textarea
            id="exercisesCannotPerform"
            name="exercisesCannotPerform"
            value={formData.exercisesCannotPerform}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="equipmentAccess" className="block text-sm font-medium text-gray-300 mb-1">
            Equipment Access
          </Label>
          <Textarea
            id="equipmentAccess"
            name="equipmentAccess"
            value={formData.equipmentAccess}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="timeConstraints" className="block text-sm font-medium text-gray-300 mb-1">
            Time Constraints or Scheduling Preferences
          </Label>
          <Textarea
            id="timeConstraints"
            name="timeConstraints"
            value={formData.timeConstraints}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="mainMotivation" className="block text-sm font-medium text-gray-300 mb-1">
            Main Motivation
          </Label>
          <Textarea
            id="mainMotivation"
            name="mainMotivation"
            value={formData.mainMotivation}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="challenges" className="block text-sm font-medium text-gray-300 mb-1">
            Challenges in Sticking to a Plan
          </Label>
          <Textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="progressTrackingMethod" className="block text-sm font-medium text-gray-300 mb-1">
            Preferred Progress Tracking Method
          </Label>
          <Input
            type="text"
            id="progressTrackingMethod"
            name="progressTrackingMethod"
            value={formData.progressTrackingMethod}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
            Start Date
          </Label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="defaultWorkoutTime" className="block text-sm font-medium text-gray-300 mb-1">
            Default Workout Start Time
          </Label>
          <Input
            type="time"
            id="defaultWorkoutTime"
            name="defaultWorkoutTime"
            value={formData.defaultWorkoutTime}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-1">
            Timezone
          </Label>
          <Input
            type="text"
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="admin-input"
          />
        </div>
      </div>

      <div className="mt-8">
        <Button type="submit" disabled={isSubmitting} className="admin-button-primary">
          {isSubmitting ? "Saving..." : "Save Questionnaire"}
        </Button>
      </div>
    </form>
  )
}
