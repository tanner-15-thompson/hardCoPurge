import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Activity } from "@/types/database"

export async function getClientActivities(clientId: number): Promise<Activity[]> {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching client activities:", error)
      return []
    }

    return data as Activity[]
  } catch (err) {
    console.error("Error in getClientActivities:", err)
    return []
  }
}
