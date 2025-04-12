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
    // Check authentication status once on component mount
    const checkAuth = () => {
      const isAuth = AdminService.isAuthenticated()
      setIsAuthenticated(isAuth)
      setIsLoading(false)

      // If not authenticated and not on login page, redirect
      if (!isAuth && pathname !== "/admin") {
        router.push("/admin")
      }
    }

    checkAuth()

    // Set up event listener for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminAuthenticated") {
        const isAuth = e.newValue === "true"
        setIsAuthenticated(isAuth)

        if (!isAuth && pathname !== "/admin") {
          router.push("/admin")
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
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
