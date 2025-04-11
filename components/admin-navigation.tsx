"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, ListChecks, Settings } from "lucide-react"
import { AdminSignout } from "@/components/admin-signout"
import { useEffect, useState } from "react"
import { AdminService } from "@/lib/admin-service"

export function AdminNavigation() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(AdminService.isAuthenticated())
  }, [])

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    {
      href: "/admin/submissions",
      label: "Submissions",
      icon: ListChecks,
    },
    {
      href: "/admin/clients",
      label: "Clients",
      icon: Users,
    },
    {
      href: "/setup",
      label: "Setup",
      icon: Settings,
    },
  ]

  return (
    <nav className="bg-gray-900 text-gray-100 h-full w-64 fixed top-0 left-0 z-50">
      <div className="p-4 border-b border-gray-800">
        <Link href="/admin" className="flex items-center space-x-2">
          <Home className="h-5 w-5" />
          <span className="font-semibold text-lg tracking-tight">Admin Dashboard</span>
        </Link>
      </div>

      <ul className="p-4 space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition-colors ${
                pathname === item.href ? "bg-gray-800 font-medium" : ""
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="p-4 mt-auto">
        <AdminSignout />
      </div>
    </nav>
  )
}
