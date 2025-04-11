import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Checks if a user has admin privileges
 * @returns boolean indicating if the user is an admin
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return false
    }

    const { data, error } = await supabase.from("admin_users").select("id").eq("id", session.user.id).single()

    if (error || !data) {
      console.error("Error checking admin status:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in checkAdminAuth function:", error)
    return false
  }
}
