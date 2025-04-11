"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, Settings, ClipboardList, Home, PlusCircle, MessageSquare } from "lucide-react"
import { AdminSignout } from "./admin-signout"

export function AdminNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") {
      return true
    }
    return pathname !== "/admin" && pathname.startsWith(path)
  }

  return (
    <div className="bg-gray-900 text-gray-200 w-64 flex-shrink-0 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <Link href="/" className="flex items-center">
            <Home className="h-6 w-6 text-purple-400" />
            <span className="ml-2 text-lg font-bold text-white">HARD Fitness</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/admin") && pathname === "/admin"
                ? "bg-gray-800 text-purple-400"
                : "hover:bg-gray-800 hover:text-purple-400"
            }`}
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Dashboard
          </Link>

          <Link
            href="/admin/clients"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/admin/clients") ? "bg-gray-800 text-purple-400" : "hover:bg-gray-800 hover:text-purple-400"
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            Clients
          </Link>

          <Link
            href="/admin/clients/new"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              pathname === "/admin/clients/new"
                ? "bg-gray-800 text-purple-400"
                : "hover:bg-gray-800 hover:text-purple-400"
            }`}
          >
            <PlusCircle className="h-5 w-5 mr-3" />
            Add Client
          </Link>

          <Link
            href="/admin/questionnaires"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/admin/questionnaires")
                ? "bg-gray-800 text-purple-400"
                : "hover:bg-gray-800 hover:text-purple-400"
            }`}
          >
            <ClipboardList className="h-5 w-5 mr-3" />
            Questionnaires
          </Link>

          <Link
            href="/admin/submissions"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/admin/submissions") ? "bg-gray-800 text-purple-400" : "hover:bg-gray-800 hover:text-purple-400"
            }`}
          >
            <MessageSquare className="h-5 w-5 mr-3" />
            Contact Submissions
          </Link>

          <Link
            href="/admin/settings"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/admin/settings") ? "bg-gray-800 text-purple-400" : "hover:bg-gray-800 hover:text-purple-400"
            }`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
        </nav>

        <div className="p-4">
          <AdminSignout />
        </div>
      </div>
    </div>
  )
}
