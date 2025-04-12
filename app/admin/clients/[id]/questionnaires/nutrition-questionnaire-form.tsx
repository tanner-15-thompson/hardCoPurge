"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveQuestionnaire } from "@/app/actions/questionnaire-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface NutritionQuestionnaireFormProps {
  clientId: number
  clientName: string
  existingData?: any
}

export function NutritionQuestionnaireForm({ clientId, clientName, existingData }: NutritionQuestionnaireFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    primaryGoal: "",
    eventDeadline: "",
    secondaryGoals: "",
    currentEatingHabits: "",
    dietaryPreferences: "",
    dietaryRestrictions: "",
    favoriteFoods: "",
    foodsToAvoid: "",
    currentWeight: "",
    height: "",
    age: "",
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
  })

  // Load existing data if available
  useEffect(() => {
    if (existingData) {
      setFormData(existingData)
    }
  }, [existingData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await saveQuestionnaire({
        client_id: clientId,
        workout_data: existingData?.workout_data || null,
        nutrition_data: formData,
      })

      if (result.success) {
        setMessage({ type: "success", text: "Nutrition questionnaire saved successfully!" })
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
    <div>
      {message && (
        <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Nutrition Questionnaire for {clientName}</h2>
          <p className="text-gray-400 text-sm">Complete the form below to create a nutrition plan.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryGoal" className="text-white">
            Primary Nutritional Goal
          </Label>
          <Textarea
            id="primaryGoal"
            name="primaryGoal"
            value={formData.primaryGoal}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What is your main nutritional goal?"
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
            Secondary Nutrition Goals
          </Label>
          <Textarea
            id="secondaryGoals"
            name="secondaryGoals"
            value={formData.secondaryGoals}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Any additional nutrition goals?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentEatingHabits" className="text-white">
            Current Eating Habits
          </Label>
          <Textarea
            id="currentEatingHabits"
            name="currentEatingHabits"
            value={formData.currentEatingHabits}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Describe your current eating patterns"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietaryPreferences" className="text-white">
            Dietary Preferences
          </Label>
          <Textarea
            id="dietaryPreferences"
            name="dietaryPreferences"
            value={formData.dietaryPreferences}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Any dietary preferences? (e.g., vegetarian, paleo, etc.)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietaryRestrictions" className="text-white">
            Dietary Restrictions
          </Label>
          <Textarea
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Any allergies or food intolerances?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="favoriteFoods" className="text-white">
            Favorite Foods
          </Label>
          <Textarea
            id="favoriteFoods"
            name="favoriteFoods"
            value={formData.favoriteFoods}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="List your favorite foods"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="foodsToAvoid" className="text-white">
            Foods to Avoid
          </Label>
          <Textarea
            id="foodsToAvoid"
            name="foodsToAvoid"
            value={formData.foodsToAvoid}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="List foods you dislike or want to avoid"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentWeight" className="text-white">
            Current Weight
          </Label>
          <Input
            id="currentWeight"
            name="currentWeight"
            type="text"
            value={formData.currentWeight}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Current weight in lbs or kg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-white">
            Height
          </Label>
          <Input
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Height (e.g., 5'10&quot; or 178cm)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-white">
            Age
          </Label>
          <Input
            id="age"
            name="age"
            type="text"
            value={formData.age}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Your age"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-white">
            Gender
          </Label>
          <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activityLevel" className="text-white">
            Activity Level
          </Label>
          <Select value={formData.activityLevel} onValueChange={(value) => handleSelectChange("activityLevel", value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="Sedentary">Sedentary</SelectItem>
              <SelectItem value="Lightly Active">Lightly Active</SelectItem>
              <SelectItem value="Moderately Active">Moderately Active</SelectItem>
              <SelectItem value="Very Active">Very Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredCuisines" className="text-white">
            Preferred Cuisines or Flavors
          </Label>
          <Textarea
            id="preferredCuisines"
            name="preferredCuisines"
            value={formData.preferredCuisines}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What cuisines or flavors do you enjoy?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cookingSkillLevel" className="text-white">
            Cooking Skill Level
          </Label>
          <Select
            value={formData.cookingSkillLevel}
            onValueChange={(value) => handleSelectChange("cookingSkillLevel", value)}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select cooking skill level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cookingFrequency" className="text-white">
            Cooking Frequency
          </Label>
          <Input
            id="cookingFrequency"
            name="cookingFrequency"
            value={formData.cookingFrequency}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="How often do you cook at home?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredMealStructure" className="text-white">
            Preferred Meal Structure
          </Label>
          <Textarea
            id="preferredMealStructure"
            name="preferredMealStructure"
            value={formData.preferredMealStructure}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="How many meals per day? Snacks? Intermittent fasting?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="typicalMealTimes" className="text-white">
            Typical Meal Times
          </Label>
          <Textarea
            id="typicalMealTimes"
            name="typicalMealTimes"
            value={formData.typicalMealTimes}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="When do you typically eat your meals?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weeklyShoppingDay" className="text-white">
            Weekly Shopping Day
          </Label>
          <Input
            id="weeklyShoppingDay"
            name="weeklyShoppingDay"
            value={formData.weeklyShoppingDay}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What day(s) do you typically grocery shop?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-white">
            City
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Where do you live? (for seasonal food availability)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetConstraints" className="text-white">
            Budget Constraints
          </Label>
          <Textarea
            id="budgetConstraints"
            name="budgetConstraints"
            value={formData.budgetConstraints}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Any budget constraints for food shopping?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeConstraints" className="text-white">
            Time Constraints for Meal Prep
          </Label>
          <Textarea
            id="timeConstraints"
            name="timeConstraints"
            value={formData.timeConstraints}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="How much time can you dedicate to meal prep?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kitchenEquipment" className="text-white">
            Access to Kitchen Equipment
          </Label>
          <Textarea
            id="kitchenEquipment"
            name="kitchenEquipment"
            value={formData.kitchenEquipment}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What kitchen equipment do you have? (e.g., blender, slow cooker)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurantPreferences" className="text-white">
            Fast Food and Restaurant Preferences
          </Label>
          <Textarea
            id="restaurantPreferences"
            name="restaurantPreferences"
            value={formData.restaurantPreferences}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Favorite restaurants or fast food places?"
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
            placeholder="What motivates you to improve your nutrition?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="challenges" className="text-white">
            Challenges in Sticking to a Nutrition Plan
          </Label>
          <Textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="What challenges do you face in sticking to a nutrition plan?"
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
            placeholder="How do you prefer to track your nutritional progress?"
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
          <Label htmlFor="preferredPlanStyle" className="text-white">
            Preferred Plan Style
          </Label>
          <Select
            value={formData.preferredPlanStyle}
            onValueChange={(value) => handleSelectChange("preferredPlanStyle", value)}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select plan style" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="Detailed Calendar">Detailed Calendar</SelectItem>
              <SelectItem value="Flexible Blueprint">Flexible Blueprint</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workoutReference" className="text-white">
            Workout Reference
          </Label>
          <Textarea
            id="workoutReference"
            name="workoutReference"
            value={formData.workoutReference}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Any details about your workout plan that would affect nutrition?"
          />
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Nutrition Questionnaire"}
        </Button>
      </form>
    </div>
  )
}
