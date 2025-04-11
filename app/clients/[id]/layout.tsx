import type React from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { Home, Menu, X } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  // Create a Supabase client directly using environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value
      },
    },
  })

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      console.error("Invalid client ID:", params.id)
      return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
          <div className="max-w-md mx-auto px-4 py-8">
            <div
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl"
              role="alert"
            >
              <p className="font-medium">Invalid client ID</p>
              <p className="text-sm mt-1">Please check the URL and try again.</p>
            </div>
          </div>
        </div>
      )
    }

    // Fetch client data
    const { data: client, error } = await supabase
      .from("clients")
      .select("id, name, email, phone")
      .eq("id", clientId)
      .single()

    if (error) {
      console.error("Error fetching client:", error)
    }

    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // For development purposes, let's be more permissive
    const clientName = client?.name || "Client"

    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="flex h-16 items-center justify-between px-4">
              <Link href={`/clients/${clientId}`} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">HARD</span>
                </div>
                <span className="font-semibold text-lg tracking-tight">Fitness</span>
              </Link>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium hidden sm:inline-block">{clientName}</span>

                {/* Mobile menu button */}
                <div className="sm:hidden">
                  <label htmlFor="mobile-menu" className="cursor-pointer">
                    <Menu className="h-6 w-6" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile menu drawer */}
        <div className="sm:hidden">
          <input type="checkbox" id="mobile-menu" className="hidden peer" />
          <div className="fixed inset-0 bg-black/50 z-50 hidden peer-checked:block" />
          <div className="fixed top-0 right-0 bottom-0 w-[250px] bg-white dark:bg-gray-900 z-50 transform translate-x-full transition-transform duration-300 ease-in-out peer-checked:translate-x-0 shadow-xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <span className="font-medium">{clientName}</span>
              <label htmlFor="mobile-menu" className="cursor-pointer">
                <X className="h-5 w-5" />
              </label>
            </div>
            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    href={`/clients/${clientId}`}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/clients/${clientId}/workout`}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6.5 17H17.5M6.5 7H17.5M4 12H20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Workouts</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/clients/${clientId}/nutrition`}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 5V19M18 11H6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Nutrition</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/clients/${clientId}/questionnaire-view`}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Questionnaire</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/clients/${clientId}/payment`}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 10H21M7 15H8M12 15H13M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Payment</span>
                  </Link>
                </li>
              </ul>
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </div>

        <main className="flex-1">{children}</main>

        {/* Bottom navigation for mobile */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
          <div className="grid grid-cols-4 h-16">
            <Link
              href={`/clients/${clientId}`}
              className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              href={`/clients/${clientId}/workout`}
              className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.5 17H17.5M6.5 7H17.5M4 12H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs mt-1">Workout</span>
            </Link>
            <Link
              href={`/clients/${clientId}/nutrition`}
              className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 5V19M18 11H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs mt-1">Nutrition</span>
            </Link>
            <Link
              href={`/clients/${clientId}/profile`}
              className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in client layout:", err)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <div className="max-w-md mx-auto px-4 py-8">
          <div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl"
            role="alert"
          >
            <p className="font-medium">An error occurred</p>
            <p className="text-sm mt-1">Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }
}
