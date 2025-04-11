import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { DailyWorkout } from "@/components/daily-workout"

export default async function ClientWorkoutPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      return notFound()
    }

    // Fetch client data to verify client exists
    const { data: client, error } = await supabase.from("clients").select("id, name").eq("id", clientId).single()

    if (error) {
      console.error("Error fetching client:", error)
      return notFound()
    }

    return (
      <div className="pb-20 sm:pb-0 bg-gray-950 min-h-screen">
        <div className="pt-6 px-4">
          <DailyWorkout clientId={clientId} />
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in client workout page:", err)
    return notFound()
  }
}
