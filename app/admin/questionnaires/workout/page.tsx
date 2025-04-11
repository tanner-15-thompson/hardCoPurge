import { Suspense } from "react"
import WorkoutQuestionnaireForm from "./workout-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function WorkoutQuestionnairePage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch all clients for the dropdown
  const { data: clients } = await supabase.from("clients").select("id, name").order("name")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Workout Questionnaire</h1>
      <Suspense fallback={<div>Loading form...</div>}>
        <WorkoutQuestionnaireForm clients={clients || []} />
      </Suspense>
    </div>
  )
}
