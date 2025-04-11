import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Checks if a user has admin privileges
 * @param userId The user ID to check
 * @returns boolean indicating if the user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    if (!userId) return false

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("admin_users").select("id").eq("id", userId).single()

    if (error || !data) {
      console.error("Error checking admin status:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in isAdmin function:", error)
    return false
  }
}
