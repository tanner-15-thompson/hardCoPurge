"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  FileText,
  Home,
  LogOut,
  Settings,
  MessageSquare,
  Calendar,
  LayoutDashboard,
  Dumbbell,
} from "lucide-react"
import { AdminSignout } from "@/components/admin-signout"

export function AdminNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-300 w-64 border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="bg-purple-600 p-1 rounded">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">HardFitness</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          href="/admin/dashboard"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/admin/dashboard") ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/admin/clients"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/admin/clients") ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Clients</span>
        </Link>

        <Link
          href="/admin/questionnaires"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/admin/questionnaires") ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Questionnaires</span>
        </Link>

        <Link
          href="/admin/prompt-generator"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/admin/prompt-generator") ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Plan Generator</span>
        </Link>

        <Link
          href="/admin/calendar"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/admin/calendar") ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span>Calendar</span>
        </Link>

        <Link
          href="/admin/settings"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/admin/settings") ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>

        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-800 hover:text-white"
        >
          <Home className="h-5 w-5" />
          <span>View Site</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <AdminSignout>
          <button className="flex items-center space-x-3 px-3 py-2 w-full text-left rounded-md transition-colors hover:bg-gray-800 hover:text-white">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </AdminSignout>
      </div>
    </div>
  )
}
