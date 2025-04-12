// Enhanced AdminService with improved authentication handling
export class AdminService {
  private static readonly AUTH_COOKIE_NAME = "admin_session"
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  /**
   * Authenticate admin user
   */
  static async signIn(email: string, password: string) {
    try {
      // Check if the credentials match the admin credentials
      if (email === process.env.ADMIN_EMAIL && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        // Generate a session token (in a real app, this would be a JWT or similar)
        const sessionToken = btoa(Date.now().toString() + Math.random().toString())
        const expiryTime = Date.now() + this.SESSION_DURATION

        // Store session data in a secure cookie
        const sessionData = JSON.stringify({
          token: sessionToken,
          expiry: expiryTime,
        })

        // Set secure cookie with session data
        document.cookie = `${this.AUTH_COOKIE_NAME}=${encodeURIComponent(sessionData)}; path=/; max-age=${this.SESSION_DURATION / 1000}; SameSite=Strict`

        // Store in localStorage for easier access (cookie is still the source of truth)
        localStorage.setItem("adminAuthenticated", "true")

        return { success: true }
      } else {
        return { success: false, message: "Invalid credentials" }
      }
    } catch (error) {
      console.error("Error signing in:", error)
      return { success: false, message: "An error occurred during sign in" }
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    try {
      // First check localStorage for quick access
      if (localStorage.getItem("adminAuthenticated") !== "true") {
        return false
      }

      // Then verify with the cookie (source of truth)
      const cookies = document.cookie.split(";")
      const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith(`${this.AUTH_COOKIE_NAME}=`))

      if (!sessionCookie) {
        // Clean up localStorage if cookie is missing
        localStorage.removeItem("adminAuthenticated")
        return false
      }

      // Parse session data
      const sessionDataStr = decodeURIComponent(sessionCookie.split("=")[1])
      const sessionData = JSON.parse(sessionDataStr)

      // Check if session is expired
      if (sessionData.expiry < Date.now()) {
        this.signOut()
        return false
      }

      return true
    } catch (error) {
      console.error("Error checking authentication:", error)
      return false
    }
  }

  /**
   * Sign out admin user
   */
  static signOut() {
    // Clear the auth cookie
    document.cookie = `${this.AUTH_COOKIE_NAME}=; path=/; max-age=0`
    // Clear localStorage
    localStorage.removeItem("adminAuthenticated")
  }
}
