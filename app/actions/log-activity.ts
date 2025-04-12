"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

type ActivityType = "workout" | "nutrition" | "profile" | "measurement" | "goal" | "system"

export async function logActivity(
  clientId: number,
  activityType: ActivityType,
  title: string,
  description: string,
  metadata: Record<string, any> = {},
) {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data, error } = await supabase.from("client_activities").insert({
      client_id: clientId,
      activity_type: activityType,
      title,
      description,
      metadata,
    })

    if (error) {
      console.error("Error logging activity:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error("Exception logging activity:", err)
    return { success: false, error: err }
  }
}
