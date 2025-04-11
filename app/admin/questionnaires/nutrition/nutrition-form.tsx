"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveNutritionQuestionnaire } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type NutritionFormData = {
  clientName: string
  primaryGoal: string
  eventDeadline: string
  secondaryGoals: string
  currentEatingHabits: string
  dietaryPreferences: string
  dietaryRestrictions: string
  favoriteFoods: string
  foodsToAvoid: string
  currentWeight: number
  height: string
  age: number
  gender: string
  activityLevel: string
  preferredCuisines: string
  cookingSkillLevel: string
  cookingFrequency: string
  preferredMealStructure: string
  typicalMealTimes: string
  weeklyShoppingDay: string
  city: string
  budgetConstraints: string
  timeConstraints: string
  kitchenEquipment: string
  restaurantPreferences: string
  mainMotivation: string
  challenges: string
  progressTrackingMethod: string
  startDate: string
  preferredPlanStyle: string
  workoutReference: string
}

const defaultFormData: NutritionFormData = {
  clientName: "",
  primaryGoal: "",
  eventDeadline: "",
  secondaryGoals: "",
  currentEatingHabits: "",
  dietaryPreferences: "",
  dietaryRestrictions: "",
  favoriteFoods: "",
  foodsToAvoid: "",
  currentWeight: 0,
  height: "",
  age: 0,
  gender: "",
  activityLevel: "",
  preferredCuisines: "",
  cookingSkillLevel: "",
  cookingFrequency: "",
  preferredMealStructure: "",
  typicalMealTimes: "",
  weeklyShoppingDay: "",
  city: "",
  budgetConstraints: "",
  timeConstraints: "",
  kitchenEquipment: "",
  restaurantPreferences: "",
  mainMotivation: "",
  challenges: "",
  progressTrackingMethod: "",
  startDate: "",
  preferredPlanStyle: "",
  workoutReference: "",
}

export function NutritionQuestionnaireForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<NutritionFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    setFormData({
      ...formData,
      [name]: type === "number" ? (value ? Number.parseFloat(value) : 0) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await saveNutritionQuestionnaire(formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        router.refresh()
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <Alert variant={message.type === "success" ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-1">
            Client Name
          </Label>
          <Input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="admin-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-300 mb-1">
            Primary Nutritional Goal
          </Label>
          <Input
            type="text"
            id="primaryGoal"
            name="primaryGoal"
            value={formData.primaryGoal}
            onChange={handleChange}
            className="admin-input"
            required
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
            Secondary Nutrition Goals
          </Label>
          <Input
            type="text"
            id="secondaryGoals"
            name="secondaryGoals"
            value={formData.secondaryGoals}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="currentEatingHabits" className="block text-sm font-medium text-gray-300 mb-1">
            Current Eating Habits
          </Label>
          <Textarea
            id="currentEatingHabits"
            name="currentEatingHabits"
            value={formData.currentEatingHabits}
            onChange={handleChange}
            className="admin-textarea"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-300 mb-1">
            Dietary Preferences
          </Label>
          <Input
            type="text"
            id="dietaryPreferences"
            name="dietaryPreferences"
            value={formData.dietaryPreferences}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-300 mb-1">
            Dietary Restrictions
          </Label>
          <Input
            type="text"
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="favoriteFoods" className="block text-sm font-medium text-gray-300 mb-1">
            Favorite Foods
          </Label>
          <Input
            type="text"
            id="favoriteFoods"
            name="favoriteFoods"
            value={formData.favoriteFoods}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="foodsToAvoid" className="block text-sm font-medium text-gray-300 mb-1">
            Foods to Avoid
          </Label>
          <Input
            type="text"
            id="foodsToAvoid"
            name="foodsToAvoid"
            value={formData.foodsToAvoid}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="currentWeight" className="block text-sm font-medium text-gray-300 mb-1">
            Current Weight (lbs)
          </Label>
          <Input
            type="number"
            id="currentWeight"
            name="currentWeight"
            value={formData.currentWeight || ""}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">
            Height
          </Label>
          <Input
            type="text"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="admin-input"
            placeholder="e.g., 5'10&quot;"
          />
        </div>

        <div>
          <Label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
            Age
          </Label>
          <Input
            type="number"
            id="age"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
            Gender
          </Label>
          <Select
            id="gender"
            name="gender"
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
            className="admin-select"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="activityLevel" className="block text-sm font-medium text-gray-300 mb-1">
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            name="activityLevel"
            value={formData.activityLevel}
            onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
            className="admin-select"
          >
            <option value="">Select Activity Level</option>
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="preferredCuisines" className="block text-sm font-medium text-gray-300 mb-1">
            Preferred Cuisines or Flavors
          </Label>
          <Input
            type="text"
            id="preferredCuisines"
            name="preferredCuisines"
            value={formData.preferredCuisines}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="cookingSkillLevel" className="block text-sm font-medium text-gray-300 mb-1">
            Cooking Skill Level
          </Label>
          <Select
            id="cookingSkillLevel"
            name="cookingSkillLevel"
            value={formData.cookingSkillLevel}
            onValueChange={(value) => setFormData({ ...formData, cookingSkillLevel: value })}
            className="admin-select"
          >
            <option value="">Select Skill Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="cookingFrequency" className="block text-sm font-medium text-gray-300 mb-1">
            Cooking Frequency
          </Label>
          <Input
            type="text"
            id="cookingFrequency"
            name="cookingFrequency"
            value={formData.cookingFrequency}
            onChange={handleChange}
            className="admin-input"
            placeholder="e.g., 3-4 times per week"
          />
        </div>

        <div>
          <Label htmlFor="preferredMealStructure" className="block text-sm font-medium text-gray-300 mb-1">
            Preferred Meal Structure
          </Label>
          <Input
            type="text"
            id="preferredMealStructure"
            name="preferredMealStructure"
            value={formData.preferredMealStructure}
            onChange={handleChange}
            className="admin-input"
            placeholder="e.g., 3 meals + 2 snacks"
          />
        </div>

        <div>
          <Label htmlFor="typicalMealTimes" className="block text-sm font-medium text-gray-300 mb-1">
            Typical Meal Times
          </Label>
          <Input
            type="text"
            id="typicalMealTimes"
            name="typicalMealTimes"
            value={formData.typicalMealTimes}
            onChange={handleChange}
            className="admin-input"
            placeholder="e.g., Breakfast 7am, Lunch 12pm, Dinner 6pm"
          />
        </div>

        <div>
          <Label htmlFor="weeklyShoppingDay" className="block text-sm font-medium text-gray-300 mb-1">
            Weekly Shopping Day
          </Label>
          <Input
            type="text"
            id="weeklyShoppingDay"
            name="weeklyShoppingDay"
            value={formData.weeklyShoppingDay}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
            City
          </Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        <div>
          <Label htmlFor="budgetConstraints" className="block text-sm font-medium text-gray-300 mb-1">
            Budget Constraints
          </Label>
          <Input
            type="text"
            id="budgetConstraints"
            name="budgetConstraints"
            value={formData.budgetConstraints}
            onChange={handleChange}
            className="admin-input"
            placeholder="e.g., $100/week for groceries"
          />
        </div>

        <div>
          <Label htmlFor="timeConstraints" className="block text-sm font-medium text-gray-300 mb-1">
            Time Constraints for Meal Prep
          </Label>
          <Input
            type="text"
            id="timeConstraints"
            name="timeConstraints"
            value={formData.timeConstraints}
            onChange={handleChange}
            className="admin-input"
            placeholder="e.g., 30 min max per meal"
          />
        </div>

        <div>
          <Label htmlFor="kitchenEquipment" className="block text-sm font-medium text-gray-300 mb-1">
            Access to Kitchen Equipment
          </Label>
          <Input
            type="text"
            id="kitchenEquipment"
            name="kitchenEquipment"
            value={formData.kitchenEquipment}
            onChange={handleChange}
            className="admin-input"
            placeholder="e.g., Instant Pot, blender, etc."
          />
        </div>

        <div>
          <Label htmlFor="restaurantPreferences" className="block text-sm font-medium text-gray-300 mb-1">
            Fast Food and Restaurant Preferences
          </Label>
          <Input
            type="text"
            id="restaurantPreferences"
            name="restaurantPreferences"
            value={formData.restaurantPreferences}
            onChange={handleChange}
            className="admin-input"
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
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="challenges" className="block text-sm font-medium text-gray-300 mb-1">
            Challenges in Sticking to a Nutrition Plan
          </Label>
          <Textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            className="admin-textarea"
            rows={2}
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
            placeholder="e.g., weekly weigh-ins, photos, etc."
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
          <Label htmlFor="preferredPlanStyle" className="block text-sm font-medium text-gray-300 mb-1">
            Preferred Plan Style
          </Label>
          <Select
            id="preferredPlanStyle"
            name="preferredPlanStyle"
            value={formData.preferredPlanStyle}
            onChange={handleChange}
            className="admin-select"
          >
            <option value="">Select Plan Style</option>
            <option value="Detailed Calendar">Detailed Calendar</option>
            <option value="Flexible Blueprint">Flexible Blueprint</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="workoutReference" className="block text-sm font-medium text-gray-300 mb-1">
            Workout Reference
          </Label>
          <Input
            type="text"
            id="workoutReference"
            name="workoutReference"
            value={formData.workoutReference}
            onChange={handleChange}
            className="admin-input"
            placeholder="Reference to workout plan if applicable"
          />
        </div>
      </div>

      <div className="mt-8">
        <Button type="submit" disabled={isSubmitting} className="admin-button-primary">
          {isSubmitting ? "Saving..." : "Save Nutrition Questionnaire"}
        </Button>
      </div>
    </form>
  )
}
