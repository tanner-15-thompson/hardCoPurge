import type React from "react"
import { AdminNavigation } from "@/components/admin-navigation"
import { AdminAuthWrapper } from "@/components/admin-auth-wrapper"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-black flex">
        {/* AdminNavigation will only be rendered on non-login admin pages */}
        <AdminNavigation />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </AdminAuthWrapper>
  )
}
