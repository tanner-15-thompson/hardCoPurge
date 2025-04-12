import { createServerSupabaseClient } from "@/lib/supabase"
import { cookies } from "next/headers"

/**
 * Checks if a user has admin privileges
 * @returns boolean indicating if the user is an admin
 */
export async function checkAdminAuth(): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      // If no Supabase session, check for our custom admin authentication
      const cookieStore = cookies()
      const adminAuthenticated = cookieStore.get("adminAuthenticated")

      if (adminAuthenticated && adminAuthenticated.value === "true") {
        return true
      }

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

/**
 * Checks if a user has admin privileges
 * @param supabase A Supabase client
 * @returns boolean indicating if the user is an admin
 */
export async function checkAdminAccess(supabase: any): Promise<boolean> {
  try {
    // First check Supabase auth
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user?.id) {
      const { data, error } = await supabase.from("admin_users").select("id").eq("id", session.user.id).single()
      if (!error && data) {
        return true
      }
    }

    // If Supabase auth fails, check for our custom admin authentication
    const cookieStore = cookies()
    const adminAuthenticated = cookieStore.get("adminAuthenticated")

    if (adminAuthenticated && adminAuthenticated.value === "true") {
      return true
    }
  } catch (error) {
    console.error("Error checking admin access:", error)
  }

  return false
}
