import { Suspense } from "react"
import { NutritionQuestionnaireForm } from "./nutrition-form"

export const metadata = {
  title: "Nutrition Questionnaire | Admin",
  description: "Manage nutrition questionnaires for clients",
}

export default function NutritionQuestionnairePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Nutrition Questionnaire</h1>
      <p className="mb-6 text-gray-300">
        Use this form to create a comprehensive nutrition questionnaire for your clients. This information will help you
        create personalized nutrition plans.
      </p>

      <Suspense fallback={<div className="text-gray-300">Loading...</div>}>
        <NutritionQuestionnaireForm />
      </Suspense>
    </div>
  )
}
