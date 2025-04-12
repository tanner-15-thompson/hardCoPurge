// This is a simplified version to understand the authentication mechanism
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
}
