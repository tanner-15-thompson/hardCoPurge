"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { AdminService } from "@/lib/admin-service"

export function AdminAuth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await AdminService.signIn(email, password)

      if (result.success) {
        setIsSuccess(true)
        // Set a cookie to indicate the user is authenticated
        document.cookie = "admin_authenticated=true; path=/; max-age=86400" // 24 hours
        // Use direct navigation
        window.location.href = "/admin/submissions"
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-6 bg-black border border-purple-900/50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="mb-6 bg-green-950/50 border-green-900 text-green-300">
          <AlertDescription>Login successful! Redirecting to admin dashboard...</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-black border-purple-900/50 focus:border-purple-700"
            placeholder="admin@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-black border-purple-900/50 focus:border-purple-700"
          />
        </div>

        <Button type="submit" className="w-full bg-purple-900 hover:bg-purple-800" disabled={isLoading || isSuccess}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : isSuccess ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  )
}
