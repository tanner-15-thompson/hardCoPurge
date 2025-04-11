import { createServerSupabaseClient } from "@/lib/supabase"

// We'll format dates manually since we might not have date-fns installed
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
}

export default async function SubmissionsPage() {
  const supabase = createServerSupabaseClient()

  const { data: submissions, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching submissions:", error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error Loading Submissions</h1>
        <p className="text-red-400">Failed to load submissions. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Contact Form Submissions</h1>

      {submissions && submissions.length > 0 ? (
        <div className="grid gap-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="border border-purple-900/50 rounded-lg p-6 bg-black">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{submission.name}</h2>
                  <p className="text-purple-400">{submission.email}</p>
                  {submission.phone && <p className="text-gray-400">{submission.phone}</p>}
                </div>
                <div className="text-right">
                  <span className="bg-purple-950/30 text-purple-400 px-3 py-1 rounded-full text-sm">
                    {submission.status}
                  </span>
                  <p className="text-sm text-gray-400 mt-1">{formatTimeAgo(new Date(submission.created_at))}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-gray-300 mb-1">Fitness Goals:</h3>
                  <p>{submission.goal}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-300 mb-1">Experience Level:</h3>
                  <p>{submission.experience}</p>
                </div>
              </div>

              {submission.message && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-300 mb-1">Additional Information:</h3>
                  <p className="text-gray-300">{submission.message}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-purple-900/30">
                <p className="text-sm text-gray-400">
                  Preferred contact method: <span className="text-white">{submission.preferred_contact}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-purple-900/30 rounded-lg">
          <p className="text-xl text-gray-400">No submissions yet</p>
        </div>
      )}
    </div>
  )
}
