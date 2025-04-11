"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminService } from "@/lib/admin-service"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Simple check using our AdminService
    const checkAuth = async () => {
      // Check if authenticated using our service
      const isAuth = AdminService.isAuthenticated()

      setIsAuthenticated(isAuth)
      setIsLoading(false)

      // If not authenticated and not on login page, redirect
      if (!isAuth && pathname !== "/admin") {
        router.push("/admin")
      }
    }

    checkAuth()
  }, [pathname, router])

  // Show loading state
  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>
  }

  // If not authenticated and not on admin index, don't render children
  if (!isAuthenticated && pathname !== "/admin") {
    return null
  }

  return <>{children}</>
}
