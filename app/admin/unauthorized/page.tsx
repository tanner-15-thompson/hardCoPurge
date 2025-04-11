import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black border border-purple-900/50 rounded-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6 text-gray-300">You do not have administrator privileges to access this area.</p>
        <div className="flex flex-col gap-4">
          <Button asChild className="bg-purple-950 hover:bg-purple-900">
            <Link href="/admin">Return to Login</Link>
          </Button>
          <Button asChild variant="outline" className="border-purple-900/50">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
