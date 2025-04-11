"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

export function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
      const isAuth = cookies.some(
        (cookie) => cookie.startsWith("admin_authenticated=") || cookie.startsWith("admin_session="),
      )
      setIsAuthenticated(isAuth)
      setIsLoading(false)

      // If not authenticated and not on the login page, redirect to login
      if (!isAuth && pathname !== "/admin") {
        router.push("/admin")
      }
    }

    checkAuth()
  }, [pathname, router])

  // Show nothing while checking authentication
  if (isLoading) {
    return null
  }

  // On login page
  if (pathname === "/admin") {
    return <>{children}</>
  }

  // On admin pages, only show content if authenticated
  return isAuthenticated ? <>{children}</> : null
}
