import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Simple admin authentication service
export const AdminService = {
  // Sign in and store auth state in localStorage
  async signIn(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const supabase = createClientComponentClient()

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        return { success: false, message: error.message }
      }

      if (!data.session) {
        return { success: false, message: "No session returned" }
      }

      // Store auth state in localStorage
      localStorage.setItem("adminAuthenticated", "true")
      localStorage.setItem("adminUserId", data.session.user.id)

      return { success: true, message: "Authentication successful" }
    } catch (error) {
      console.error("Sign in exception:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    // Check localStorage first (for client-side)
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminAuthenticated") === "true"
    }
    return false
  },

  // Sign out
  async signOut(): Promise<void> {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminAuthenticated")
      localStorage.removeItem("adminUserId")
    }
  },
}
