"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ComprehensiveQuestionnaireProps {
  clientId: number
  clientName: string
  initialWorkoutData?: any
  initialNutritionData?: any
}

export function ComprehensiveQuestionnaire({
  clientId,
  clientName,
  initialWorkoutData,
  initialNutritionData,
}: ComprehensiveQuestionnaireProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [activeTab, setActiveTab] = useState("workout")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Workout questionnaire state
  const [workoutData, setWorkoutData] = useState({
    goal: initialWorkoutData?.goal || "",
    experience_level: initialWorkoutData?.experience_level || "beginner",
    training_frequency: initialWorkoutData?.training_frequency || 3,
    session_duration: initialWorkoutData?.session_duration || 60,
    preferred_training_style: initialWorkoutData?.preferred_training_style || "balanced",
    available_equipment: initialWorkoutData?.available_equipment || [],
    injuries_limitations: initialWorkoutData?.injuries_limitations || "",
    current_activity_level: initialWorkoutData?.current_activity_level || "moderate",
    strength_focus_areas: initialWorkoutData?.strength_focus_areas || [],
    cardio_preferences: initialWorkoutData?.cardio_preferences || [],
    fitness_tests: initialWorkoutData?.fitness_tests || {},
    additional_notes: initialWorkoutData?.additional_notes || "",
  })

  // Nutrition questionnaire state
  const [nutritionData, setNutritionData] = useState({
    goal: initialNutritionData?.goal || "",
    current_diet: initialNutritionData?.current_diet || "",
    dietary_restrictions: initialNutritionData?.dietary_restrictions || [],
    allergies: initialNutritionData?.allergies || "",
    meal_frequency: initialNutritionData?.meal_frequency || 3,
    cooking_skill: initialNutritionData?.cooking_skill || "intermediate",
    prep_time: initialNutritionData?.prep_time || "moderate",
    water_intake: initialNutritionData?.water_intake || "",
    supplement_use: initialNutritionData?.supplement_use || "",
    problem_foods: initialNutritionData?.problem_foods || "",
    favorite_foods: initialNutritionData?.favorite_foods || "",
    additional_notes: initialNutritionData?.additional_notes || "",
  })

  const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setWorkoutData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNutritionData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (category: string, value: string, isChecked: boolean) => {
    if (activeTab === "workout") {
      setWorkoutData((prev) => {
        const currentValues = Array.isArray(prev[category]) ? [...prev[category]] : []
        if (isChecked) {
          return { ...prev, [category]: [...currentValues, value] }
        } else {
          return { ...prev, [category]: currentValues.filter((item) => item !== value) }
        }
      })
    } else {
      setNutritionData((prev) => {
        const currentValues = Array.isArray(prev[category]) ? [...prev[category]] : []
        if (isChecked) {
          return { ...prev, [category]: [...currentValues, value] }
        } else {
          return { ...prev, [category]: currentValues.filter((item) => item !== value) }
        }
      })
    }
  }

  const handleFitnessTestChange = (test: string, value: string) => {
    setWorkoutData((prev) => ({
      ...prev,
      fitness_tests: {
        ...prev.fitness_tests,
        [test]: value,
      },
    }))
  }

  const saveQuestionnaire = async () => {
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // Save workout data
      const { error: workoutError } = await supabase.from("client_questionnaires").upsert({
        client_id: clientId,
        workout_data: workoutData,
        nutrition_data: nutritionData,
        updated_at: new Date().toISOString(),
      })

      if (workoutError) throw workoutError

      setSuccess("Questionnaire saved successfully!")
      router.refresh()
    } catch (err: any) {
      console.error("Error saving questionnaire:", err)
      setError(err.message || "An error occurred while saving the questionnaire")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Questionnaire for {clientName}</h2>
        <Button onClick={saveQuestionnaire} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Questionnaire"
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/20 border-green-800 text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-700">
          <TabsTrigger value="workout" className="data-[state=active]:bg-purple-600">
            Workout Questionnaire
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="data-[state=active]:bg-green-600">
            Nutrition Questionnaire
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="goal">Primary Fitness Goal</Label>
              <select
                id="goal"
                name="goal"
                value={workoutData.goal}
                onChange={handleWorkoutChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white"
              >
                <option value="">Select a goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="strength">Strength</option>
                <option value="endurance">Endurance</option>
                <option value="general_fitness">General Fitness</option>
                <option value="athletic_performance">Athletic Performance</option>
                <option value="rehabilitation">Rehabilitation</option>
              </select>
            </div>

            <div>
              <Label htmlFor="experience_level">Experience Level</Label>
              <select
                id="experience_level"
                name="experience_level"
                value={workoutData.experience_level}
                onChange={handleWorkoutChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="elite">Elite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="training_frequency">Training Frequency (days per week)</Label>
              <Input
                id="training_frequency"
                name="training_frequency"
                type="number"
                min="1"
                max="7"
                value={workoutData.training_frequency}
                onChange={handleWorkoutChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="session_duration">Preferred Session Duration (minutes)</Label>
              <Input
                id="session_duration"
                name="session_duration"
                type="number"
                min="15"
                max="180"
                step="15"
                value={workoutData.session_duration}
                onChange={handleWorkoutChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="preferred_training_style">Preferred Training Style</Label>
            <select
              id="preferred_training_style"
              name="preferred_training_style"
              value={workoutData.preferred_training_style}
              onChange={handleWorkoutChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white"
            >
              <option value="balanced">Balanced (Strength & Cardio)</option>
              <option value="strength_focused">Strength Focused</option>
              <option value="cardio_focused">Cardio Focused</option>
              <option value="hiit">High Intensity Interval Training</option>
              <option value="circuit">Circuit Training</option>
              <option value="functional">Functional Training</option>
              <option value="sport_specific">Sport Specific</option>
            </select>
          </div>

          <div>
            <Label className="mb-2 block">Available Equipment</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Dumbbells",
                "Barbell",
                "Kettlebells",
                "Resistance Bands",
                "Pull-up Bar",
                "Bench",
                "Squat Rack",
                "Cable Machine",
                "Treadmill",
                "Bike",
                "Rowing Machine",
                "Elliptical",
                "TRX/Suspension Trainer",
                "Medicine Ball",
                "Yoga Mat",
              ].map((equipment) => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox
                    id={`equipment-${equipment}`}
                    checked={workoutData.available_equipment.includes(equipment)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("available_equipment", equipment, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`equipment-${equipment}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                  >
                    {equipment}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="injuries_limitations">Injuries or Limitations</Label>
            <Textarea
              id="injuries_limitations"
              name="injuries_limitations"
              value={workoutData.injuries_limitations}
              onChange={handleWorkoutChange}
              placeholder="Describe any injuries, medical conditions, or physical limitations"
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>

          <div>
            <Label className="mb-2 block">Current Activity Level</Label>
            <RadioGroup
              value={workoutData.current_activity_level}
              onValueChange={(value) => setWorkoutData((prev) => ({ ...prev, current_activity_level: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sedentary" id="activity-sedentary" />
                <Label htmlFor="activity-sedentary" className="text-white">
                  Sedentary (Little to no exercise)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="activity-light" />
                <Label htmlFor="activity-light" className="text-white">
                  Light (Light exercise 1-3 days/week)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="activity-moderate" />
                <Label htmlFor="activity-moderate" className="text-white">
                  Moderate (Moderate exercise 3-5 days/week)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="activity-active" />
                <Label htmlFor="activity-active" className="text-white">
                  Active (Hard exercise 6-7 days/week)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_active" id="activity-very-active" />
                <Label htmlFor="activity-very-active" className="text-white">
                  Very Active (Hard daily exercise & physical job or training twice daily)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block">Strength Focus Areas</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Upper Body", "Lower Body", "Core", "Back", "Chest", "Shoulders", "Arms", "Legs", "Glutes"].map(
                (area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={`strength-${area}`}
                      checked={workoutData.strength_focus_areas.includes(area)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("strength_focus_areas", area, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`strength-${area}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                    >
                      {area}
                    </label>
                  </div>
                ),
              )}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Cardio Preferences</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Running",
                "Walking",
                "Cycling",
                "Swimming",
                "Rowing",
                "Elliptical",
                "Stair Climber",
                "Jump Rope",
                "HIIT",
              ].map((cardio) => (
                <div key={cardio} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cardio-${cardio}`}
                    checked={workoutData.cardio_preferences.includes(cardio)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("cardio_preferences", cardio, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`cardio-${cardio}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                  >
                    {cardio}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-4 block">Fitness Tests (if available)</Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="test-pushups" className="text-sm text-gray-300">
                  Push-ups (max reps)
                </Label>
                <Input
                  id="test-pushups"
                  value={workoutData.fitness_tests.pushups || ""}
                  onChange={(e) => handleFitnessTestChange("pushups", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="test-pullups" className="text-sm text-gray-300">
                  Pull-ups (max reps)
                </Label>
                <Input
                  id="test-pullups"
                  value={workoutData.fitness_tests.pullups || ""}
                  onChange={(e) => handleFitnessTestChange("pullups", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="test-plank" className="text-sm text-gray-300">
                  Plank (max time in seconds)
                </Label>
                <Input
                  id="test-plank"
                  value={workoutData.fitness_tests.plank || ""}
                  onChange={(e) => handleFitnessTestChange("plank", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="test-mile" className="text-sm text-gray-300">
                  1 Mile Run (time in minutes:seconds)
                </Label>
                <Input
                  id="test-mile"
                  value={workoutData.fitness_tests.mile_run || ""}
                  onChange={(e) => handleFitnessTestChange("mile_run", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              name="additional_notes"
              value={workoutData.additional_notes}
              onChange={handleWorkoutChange}
              placeholder="Any other information that would be helpful for creating your workout plan"
              className="bg-gray-700 border-gray-600 text-white"
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nutrition-goal">Nutrition Goal</Label>
              <select
                id="nutrition-goal"
                name="goal"
                value={nutritionData.goal}
                onChange={handleNutritionChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
              >
                <option value="">Select a goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="performance">Performance</option>
                <option value="health_improvement">Health Improvement</option>
              </select>
            </div>

            <div>
              <Label htmlFor="current_diet">Current Diet Description</Label>
              <Textarea
                id="current_diet"
                name="current_diet"
                value={nutritionData.current_diet}
                onChange={handleNutritionChange}
                placeholder="Describe your current eating habits"
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Dietary Restrictions</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Vegetarian",
                "Vegan",
                "Gluten-Free",
                "Dairy-Free",
                "Nut-Free",
                "Pescatarian",
                "Keto",
                "Paleo",
                "Low FODMAP",
                "Kosher",
                "Halal",
              ].map((restriction) => (
                <div key={restriction} className="flex items-center space-x-2">
                  <Checkbox
                    id={`restriction-${restriction}`}
                    checked={nutritionData.dietary_restrictions.includes(restriction)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("dietary_restrictions", restriction, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`restriction-${restriction}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                  >
                    {restriction}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="allergies">Food Allergies or Intolerances</Label>
            <Textarea
              id="allergies"
              name="allergies"
              value={nutritionData.allergies}
              onChange={handleNutritionChange}
              placeholder="List any food allergies or intolerances"
              className="bg-gray-700 border-gray-600 text-white"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="meal_frequency">Preferred Meals Per Day</Label>
              <Input
                id="meal_frequency"
                name="meal_frequency"
                type="number"
                min="1"
                max="6"
                value={nutritionData.meal_frequency}
                onChange={handleNutritionChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="cooking_skill">Cooking Skill Level</Label>
              <select
                id="cooking_skill"
                name="cooking_skill"
                value={nutritionData.cooking_skill}
                onChange={handleNutritionChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="prep_time">Available Meal Prep Time</Label>
            <select
              id="prep_time"
              name="prep_time"
              value={nutritionData.prep_time}
              onChange={handleNutritionChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
            >
              <option value="minimal">Minimal (15 minutes or less)</option>
              <option value="moderate">Moderate (15-30 minutes)</option>
              <option value="extensive">Extensive (30+ minutes)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="water_intake">Current Water Intake</Label>
            <Input
              id="water_intake"
              name="water_intake"
              value={nutritionData.water_intake}
              onChange={handleNutritionChange}
              placeholder="Approximate daily water intake (cups/oz)"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="supplement_use">Current Supplement Use</Label>
            <Textarea
              id="supplement_use"
              name="supplement_use"
              value={nutritionData.supplement_use}
              onChange={handleNutritionChange}
              placeholder="List any supplements you currently take"
              className="bg-gray-700 border-gray-600 text-white"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="problem_foods">Problem Foods</Label>
              <Textarea
                id="problem_foods"
                name="problem_foods"
                value={nutritionData.problem_foods}
                onChange={handleNutritionChange}
                placeholder="Foods you struggle with or tend to overeat"
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="favorite_foods">Favorite Healthy Foods</Label>
              <Textarea
                id="favorite_foods"
                name="favorite_foods"
                value={nutritionData.favorite_foods}
                onChange={handleNutritionChange}
                placeholder="Healthy foods you enjoy eating"
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nutrition_additional_notes">Additional Notes</Label>
            <Textarea
              id="nutrition_additional_notes"
              name="additional_notes"
              value={nutritionData.additional_notes}
              onChange={handleNutritionChange}
              placeholder="Any other information that would be helpful for creating your nutrition plan"
              className="bg-gray-700 border-gray-600 text-white"
              rows={4}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveQuestionnaire} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Questionnaire"
          )}
        </Button>
      </div>
    </div>
  )
}
