import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

type ActivityType = "workout" | "nutrition" | "profile" | "measurement" | "goal" | "system"

interface ActivityData {
  clientId: number
  activityType: ActivityType
  title: string
  description: string
  metadata?: Record<string, any>
}

export async function logClientActivity({ clientId, activityType, title, description, metadata = {} }: ActivityData) {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data, error } = await supabase
      .from("client_activities")
      .insert({
        client_id: clientId,
        activity_type: activityType,
        title,
        description,
        metadata,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error logging client activity:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error("Exception logging client activity:", err)
    return { success: false, error: err }
  }
}
