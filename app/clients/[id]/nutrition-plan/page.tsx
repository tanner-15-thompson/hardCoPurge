import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ClientNutritionPlan from "./client-page"

export default async function NutritionPlanPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      return (
        <div className="max-w-md mx-auto px-4 py-8">
          <div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl"
            role="alert"
          >
            <p className="font-medium">Invalid client ID</p>
            <p className="text-sm mt-1">Please check the URL and try again.</p>
          </div>
        </div>
      )
    }

    // Try to fetch from client_nutrition first
    let { data: nutritionData, error: nutritionError } = await supabase
      .from("client_nutrition")
      .select("nutrition_html")
      .eq("client_id", clientId)
      .limit(1)

    // If that fails, try nutrition_plans
    if (nutritionError || !nutritionData || nutritionData.length === 0) {
      const { data: planData, error: planError } = await supabase
        .from("nutrition_plans")
        .select("content")
        .eq("client_id", clientId)
        .limit(1)

      if (!planError && planData && planData.length > 0) {
        nutritionData = planData.map((item) => ({ nutrition_html: item.content }))
        nutritionError = null
      } else {
        // If both fail, use the last error
        nutritionError = planError || nutritionError
      }
    }

    // Extract the nutrition HTML
    const nutritionHtml = nutritionData && nutritionData.length > 0 ? nutritionData[0].nutrition_html : null

    return (
      <div className="pb-20 sm:pb-0">
        <div className="bg-gradient-to-br from-green-600 to-teal-500 text-white">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center mb-2">
              <Link
                href={`/clients/${clientId}`}
                className="flex items-center text-green-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Your Nutrition Plan</h1>
            <p className="mt-1 text-green-100">Complete nutrition details with meals, macros, and guidelines.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          {nutritionError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
              <p className="font-medium">Error fetching nutrition plan</p>
              <p className="text-sm mt-1">{nutritionError.message}</p>
            </div>
          ) : nutritionHtml ? (
            <ClientNutritionPlan nutritionHtml={nutritionHtml} />
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-xl">
              <p className="font-medium">No nutrition plan found</p>
              <p className="text-sm mt-1">Your trainer hasn't uploaded a nutrition plan yet.</p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link
              href={`/clients/${clientId}/nutrition`}
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700 disabled:pointer-events-none disabled:opacity-50"
            >
              Log Today's Nutrition
            </Link>
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in nutrition plan page:", err)
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl"
          role="alert"
        >
          <p className="font-medium">An error occurred</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      </div>
    )
  }
}
