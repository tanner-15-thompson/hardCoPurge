import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { NutritionDisplay } from "@/components/nutrition-display"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react"

export default async function ClientNutritionPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      return notFound()
    }

    // Fetch client data
    const { data: client, error } = await supabase
      .from("clients")
      .select("id, name, email, phone")
      .eq("id", clientId)
      .single()

    if (error) {
      console.error("Error fetching client:", error)
    }

    // Get today's date in a nice format
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }
    const formattedDate = today.toLocaleDateString("en-US", options)

    return (
      <div className="pb-20 sm:pb-0">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Nutrition Plan</h1>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Log Meal
              </Button>
            </div>
          </div>
        </div>

        {/* Date selector */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-2">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Nutrition summary */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-medium">Today's Summary</h2>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold">1,850</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Calories</div>
                  <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-green-500 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">145g</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Protein</div>
                  <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-blue-500 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">180g</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Carbs</div>
                  <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-yellow-500 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">60g</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Fat</div>
                  <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-red-500 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition plan */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-medium">Nutrition Plan</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your personalized meal plan</p>
            </div>

            <div className="p-4">
              <NutritionDisplay clientId={clientId} />
            </div>
          </div>

          {/* Water intake */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Water Intake</h2>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Today's Goal</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3 / 8 glasses</p>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-4 bg-blue-500 rounded-full" style={{ width: "37.5%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in client nutrition page:", err)
    return notFound()
  }
}
