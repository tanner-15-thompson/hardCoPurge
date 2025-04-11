import { AdminAuth } from "@/components/admin-auth"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AdminAuth />
      </div>
    </div>
  )
}
