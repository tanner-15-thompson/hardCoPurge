import type React from "react"
import { AdminNavigation } from "@/components/admin-navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminNavigation />
      <main className="ml-0 md:ml-64 p-4">{children}</main>
    </div>
  )
}
