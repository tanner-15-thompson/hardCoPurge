"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import DOMPurify from "dompurify"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import { parseNutritionHtml } from "@/components/nutrition-parser"
import { PDFNutritionUploader } from "@/components/pdf-nutrition-uploader"

interface NutritionDisplayProps {
  clientId: number
  nutritionHtml?: string
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

export function NutritionDisplay({ clientId, nutritionHtml }: NutritionDisplayProps) {
  const [html, setHtml] = useState<string>(nutritionHtml || "")
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [nutritionDays, setNutritionDays] = useState<any[]>([])
  const [completedMeals, setCompletedMeals] = useState<Record<string, Record<string, boolean>>>({})
  const [loading, setLoading] = useState(true)
  const [tablesExist, setTablesExist] = useState(false)
  const [selectedDay, setSelectedDay] = useState<any>(null)
  const [showMealForm, setShowMealForm] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  // Check if tables exist
  useEffect(() => {
    const checkTables = async () => {
      try {
        // Try to fetch from client_nutrition_plans to see if it exists
        const { error } = await supabase.from("client_nutrition_plans").select("id").limit(1)

        if (error && error.message.includes("does not exist")) {
          // Tables don't exist, try to create them
          await fetch("/api/setup-database")
          // Wait a moment for tables to be created
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setTablesExist(true)
        } else {
          // Table exists
          setTablesExist(true)
        }
      } catch (error: any) {
        console.error("Error checking tables:", error)
        setDbError(error.message)
      }
    }

    checkTables()
  }, [supabase])

  // Parse nutrition HTML to extract days
  useEffect(() => {
    if (html) {
      // Extract day sections from HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      // First check if there's a Plan Overview section
      let planOverview = null
      const h2Elements = doc.querySelectorAll("h2")
      for (const h2 of h2Elements) {
        const text = h2.textContent || ""
        if (text.includes("Plan Overview") || text.includes("Nutrition Plan Overview") || text.includes("Overview")) {
          planOverview = h2
          break
        }
      }

      // Find all h3 elements that might contain day information
      const dayElements = doc.querySelectorAll("h3")
      const days: any[] = []

      // Check if we have day-specific headings
      let hasDayHeadings = false
      for (const el of dayElements) {
        if (
          el.textContent &&
          (el.textContent.includes("Day") || (el.textContent.match && el.textContent.match(/\d{4}-\d{2}-\d{2}/)))
        ) {
          hasDayHeadings = true
          break
        }
      }

      if (hasDayHeadings) {
        // Process day-specific headings
        dayElements.forEach((element, index) => {
          // Check if this is a day heading (contains "Day" and a number)
          if (
            element.textContent &&
            (element.textContent.includes("Day") || element.textContent.match(/\d{4}-\d{2}-\d{2}/))
          ) {
            const dayContent = element.nextElementSibling
            const dayTitle = element.textContent.trim()

            // Extract date from the heading if available
            let dayId = `day-${index + 1}` // Default fallback

            const extractedDate = extractDateFromDayTitle(dayTitle)
            if (extractedDate) {
              dayId = `day-${extractedDate}`
            }

            // Try to parse meals from the content
            const contentHtml = dayContent ? dayContent.outerHTML : ""
            const { meals } = parseNutritionHtml(contentHtml)

            // Create a day object with the heading and content
            days.push({
              id: dayId,
              title: dayTitle,
              content: contentHtml,
              dayNumber: index + 1,
              meals: meals,
            })
          }
        })
      } else {
        // If no day-specific headings, create days based on meal types
        const mealSections = doc.querySelectorAll("h3")
        const mealTypes = ["Breakfast", "Lunch", "Dinner"]

        // Group by meal types
        const mealsByType: Record<string, any[]> = {}

        mealSections.forEach((section) => {
          const sectionTitle = section.textContent || ""
          const mealType = mealTypes.find((type) => sectionTitle.includes(type))

          if (mealType) {
            const nextElement = section.nextElementSibling
            if (nextElement && nextElement.tagName === "UL") {
              if (!mealsByType[mealType]) {
                mealsByType[mealType] = []
              }

              const mealItems = nextElement.querySelectorAll("li")
              mealItems.forEach((item) => {
                mealsByType[mealType].push({
                  name: item.textContent || `${mealType} Option`,
                  type: mealType.toLowerCase() as any,
                  content: item.innerHTML,
                })
              })
            }
          }
        })

        // Create a day for each meal type
        Object.entries(mealsByType).forEach(([type, meals], index) => {
          days.push({
            id: `day-${index + 1}`,
            title: `${type} Options`,
            content: `<ul>${meals.map((m) => `<li>${m.content}</li>`).join("")}</ul>`,
            dayNumber: index + 1,
            meals: meals.map((m) => ({
              name: m.name,
              type: m.type,
            })),
          })
        })
      }

      setNutritionDays(days)
    }
  }, [html])

  // Add a function to check and fix database schema
  const checkAndFixDatabaseSchema = async () => {
    try {
      // Call the setup-database endpoint to ensure all tables and functions exist
      const response = await fetch("/api/setup-database")
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Database setup failed:", errorData)
        setDbError(`Database setup failed: ${errorData.error || "Unknown error"}`)
        return false
      }
      return true
    } catch (error: any) {
      console.error("Error checking/fixing database schema:", error)
      setDbError(`Error checking database schema: ${error.message || "Unknown error"}`)
      return false
    }
  }

  // Fetch nutrition data and completion status
  const fetchNutritionData = async () => {
    if (!tablesExist) return

    setLoading(true)
    try {
      // Check and fix database schema if needed
      await checkAndFixDatabaseSchema()

      // Fetch nutrition HTML if not provided
      if (!nutritionHtml) {
        // Get the most recent nutrition plan for this client
        const { data: nutritionData, error } = await supabase
          .from("client_nutrition_plans")
          .select("nutrition_html")
          .eq("client_id", clientId)
          .order("created_at", { ascending: false })
          .limit(1)

        if (error) {
          if (!error.message.includes("does not exist")) {
            console.error("Error fetching nutrition plan:", error)
            setDbError(error.message)
          }
        } else if (nutritionData && nutritionData.length > 0) {
          setHtml(nutritionData[0].nutrition_html)
        }
      }

      // Fetch completed meals
      const { data: completionData, error: completionError } = await supabase
        .from("meal_completions")
        .select("day_id, meal_id, completed_at")
        .eq("client_id", clientId)

      if (completionError && !completionError.message.includes("does not exist")) {
        console.error("Error fetching meal completions:", completionError)
        setDbError(completionError.message)
      }

      if (completionData) {
        const completions: Record<string, Record<string, boolean>> = {}
        completionData.forEach((item) => {
          if (!completions[item.day_id]) {
            completions[item.day_id] = {}
          }
          completions[item.day_id][item.meal_id] = true
        })
        setCompletedMeals(completions)
      }
    } catch (error: any) {
      console.error("Error fetching nutrition data:", error)
      setDbError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Add this useEffect after the fetchNutritionData function definition
  useEffect(() => {
    if (tablesExist) {
      fetchNutritionData()
    }
  }, [clientId, nutritionHtml, supabase, tablesExist])

  // Save nutrition HTML to database
  const saveNutritionHtml = async () => {
    if (!html.trim()) {
      alert("Please enter nutrition plan content before saving.")
      return
    }

    try {
      // First check if a record already exists for this client
      const { data: existingRecords, error: checkError } = await supabase
        .from("client_nutrition_plans")
        .select("id")
        .eq("client_id", clientId)

      if (checkError) {
        // If the error is because the table doesn't exist, show a helpful message
        if (checkError.message.includes("does not exist")) {
          alert(`The database tables don't exist yet. Please run the API setup endpoint first.`)
          return
        }

        console.error("Error checking for existing nutrition plan:", checkError)
        throw checkError
      }

      if (existingRecords && existingRecords.length > 0) {
        // Update the most recent record
        const { error: updateError } = await supabase
          .from("client_nutrition_plans")
          .update({
            nutrition_html: html,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingRecords[0].id)

        if (updateError) throw updateError
      } else {
        // Insert new record
        const { error: insertError } = await supabase.from("client_nutrition_plans").insert({
          client_id: clientId,
          nutrition_html: html,
        })

        if (insertError) throw insertError
      }

      alert("Nutrition plan saved successfully!")
    } catch (error: any) {
      console.error("Error saving nutrition plan:", error)
      alert(`Failed to save nutrition plan: ${error.message || "Unknown error"}`)
    }
  }

  // Toggle meal completion status
  const toggleMealCompletion = async (dayId: string, mealId: string) => {
    if (!tablesExist) {
      alert("Database tables not set up. Please save the nutrition plan first.")
      return
    }

    try {
      if (completedMeals[dayId]?.[mealId]) {
        // Delete completion record
        await supabase
          .from("meal_completions")
          .delete()
          .eq("client_id", clientId)
          .eq("day_id", dayId)
          .eq("meal_id", mealId)

        setCompletedMeals((prev) => {
          const updated = { ...prev }
          if (updated[dayId]) {
            const updatedDay = { ...updated[dayId] }
            delete updatedDay[mealId]
            updated[dayId] = updatedDay
          }
          return updated
        })
      } else {
        // Add completion record
        await supabase.from("meal_completions").insert({
          client_id: clientId,
          day_id: dayId,
          meal_id: mealId,
          completed_at: new Date().toISOString(),
        })

        setCompletedMeals((prev) => {
          const updated = { ...prev }
          if (!updated[dayId]) {
            updated[dayId] = {}
          }
          updated[dayId][mealId] = true
          return updated
        })
      }
    } catch (error: any) {
      console.error("Error toggling meal completion:", error)
      setDbError(error.message)
    }
  }

  // Handle HTML input change
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtml(e.target.value)
  }

  if (loading && tablesExist) {
    return <div className="p-6 text-center">Loading nutrition data...</div>
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Nutrition Plan</h2>
        <div className="flex space-x-2">
          {!html && (
            <Button onClick={() => setActiveTab("input")} variant="outline" size="sm">
              Add Nutrition Plan
            </Button>
          )}
          {html && (
            <Button onClick={saveNutritionHtml} variant="outline" size="sm">
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="daily">Daily Meals</TabsTrigger>
            <TabsTrigger value="input">Edit Plan</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-6">
          {html ? (
            <div>
              <div
                className="workout-plan-html bg-gray-900 p-6 rounded-lg shadow-md"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
              />

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Nutrition Progress</h3>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          nutritionDays.length > 0
                            ? (
                                Object.keys(completedMeals).reduce(
                                  (total, dayId) => total + Object.keys(completedMeals[dayId] || {}).length,
                                  0,
                                ) / nutritionDays.reduce((total, day) => total + day.meals.length, 0)
                              ) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-4 text-sm font-medium">
                    {Object.keys(completedMeals).reduce(
                      (total, dayId) => total + Object.keys(completedMeals[dayId] || {}).length,
                      0,
                    )}{" "}
                    / {nutritionDays.reduce((total, day) => total + day.meals.length, 0)} meals tracked
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Nutrition Plan Yet</h3>
              <p className="text-gray-500 mb-4">Add a nutrition plan to get started tracking your meals.</p>
              <Button onClick={() => setActiveTab("input")}>Add Nutrition Plan</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="daily" className="p-6">
          {nutritionDays.length > 0 ? (
            <div className="space-y-4">
              {nutritionDays.map((day) => (
                <div
                  key={day.id}
                  className={`border-2 rounded-lg overflow-hidden shadow-md ${
                    Object.keys(completedMeals[day.id] || {}).length === day.meals.length
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white border-b border-gray-700">
                    <h3 className="font-bold text-white">{day.title}</h3>
                  </div>
                  <div className="p-4 bg-white">
                    <div
                      className="workout-plan-html bg-gray-900 p-4 rounded-lg shadow-md mb-4"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(day.content) }}
                    />

                    <div className="space-y-4 mt-4">
                      <h4 className="font-medium text-lg">Track Meals</h4>
                      {day.meals.map((meal: any, index: number) => (
                        <div
                          key={index}
                          className={`border rounded-lg p-3 ${
                            completedMeals[day.id]?.[`meal-${index}`]
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{meal.name}</h4>
                            <Button
                              variant={completedMeals[day.id]?.[`meal-${index}`] ? "default" : "outline"}
                              size="sm"
                              className={
                                completedMeals[day.id]?.[`meal-${index}`] ? "bg-green-600 hover:bg-green-700" : ""
                              }
                              onClick={() => toggleMealCompletion(day.id, `meal-${index}`)}
                            >
                              {completedMeals[day.id]?.[`meal-${index}`] ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Completed
                                </>
                              ) : (
                                "Mark Complete"
                              )}
                            </Button>
                          </div>
                          {meal.calories || meal.protein || meal.carbs || meal.fat ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {meal.calories && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {meal.calories} kcal
                                </span>
                              )}
                              {meal.protein && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                  {meal.protein} protein
                                </span>
                              )}
                              {meal.carbs && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                  {meal.carbs} carbs
                                </span>
                              )}
                              {meal.fat && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                  {meal.fat} fat
                                </span>
                              )}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Nutrition Plan Found</h3>
              <p className="text-gray-500">Add a nutrition plan to start tracking your meals.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="input" className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="nutrition-html" className="block text-sm font-medium text-gray-700 mb-2">
                Paste Nutrition HTML
              </label>
              <textarea
                id="nutrition-html"
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={html}
                onChange={handleHtmlChange}
                placeholder="Paste the nutrition HTML here..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Paste the HTML nutrition plan content here. The system will automatically parse daily meals and recipes.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Or Upload PDF</h4>
              <PDFNutritionUploader onHtmlExtracted={setHtml} />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setActiveTab("overview")}>
                Cancel
              </Button>
              <Button onClick={saveNutritionHtml} disabled={!html} className="bg-purple-600 hover:bg-purple-700">
                Save Nutrition Plan
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
