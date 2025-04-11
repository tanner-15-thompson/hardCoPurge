import Link from "next/link"
import { Shield } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="bg-red-900/20 p-3 rounded-full inline-flex mb-6">
          <Shield className="h-12 w-12 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Access Denied</h1>
        <p className="text-gray-300 mb-8">
          You don't have permission to access this page. Please contact an administrator if you believe this is an
          error.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admin"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            Return to Admin Login
          </Link>
          <Link href="/" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
