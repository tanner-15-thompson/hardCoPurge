import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Checks if a user has admin privileges
 * @returns boolean indicating if the user is an admin
 */
export class AdminService {
  static async signIn(email: string, password: string) {
    try {
      // Check if the credentials match the admin credentials
      if (email === process.env.ADMIN_EMAIL && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        // Set a cookie to indicate the user is authenticated
        document.cookie = "admin_authenticated=true; path=/; max-age=86400" // 24 hours
        return { success: true }
      } else {
        return { success: false, message: "Invalid credentials" }
      }
    } catch (error) {
      console.error("Error signing in:", error)
      return { success: false, message: "An error occurred during sign in" }
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    // Check if the admin_authenticated cookie is set
    return document.cookie.includes("admin_authenticated=true")
  }

  static async signOut() {
    // Clear the admin_authenticated cookie
    document.cookie = "admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }

  static async getClient(clientId: number) {
    const supabase = createServerSupabaseClient()

    try {
      const { data: client, error } = await supabase.from("clients").select("*").eq("id", clientId).single()

      if (error) {
        console.error("Error fetching client:", error)
        return null
      }

      return client
    } catch (error) {
      console.error("Error in getClient:", error)
      return null
    }
  }
}

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

export const getClient = AdminService.getClient
