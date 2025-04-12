import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Users, FileText, Activity, PlusCircle, Calendar, ChevronRight } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch summary data
  const { data: clientCount } = await supabase.from("clients").select("id", { count: "exact", head: true })
  const { data: recentClients } = await supabase
    .from("clients")
    .select("id, name, email, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentQuestionnaires } = await supabase
    .from("client_questionnaires")
    .select("id, client_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  // Join with clients to get names
  let questionnairesWithNames = []
  if (recentQuestionnaires && recentQuestionnaires.length > 0) {
    const clientIds = recentQuestionnaires.map((q) => q.client_id)
    const { data: clientsData } = await supabase.from("clients").select("id, name").in("id", clientIds)

    const clientMap = new Map()
    if (clientsData) {
      clientsData.forEach((client) => {
        clientMap.set(client.id, client.name)
      })
    }

    questionnairesWithNames = recentQuestionnaires.map((q) => ({
      ...q,
      clientName: clientMap.get(q.client_id) || "Unknown Client",
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          href="/admin/clients/new"
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors"
        >
          <PlusCircle className="h-8 w-8 mb-2" />
          <span className="text-lg font-medium">New Client</span>
        </Link>

        <Link
          href="/admin/clients"
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors"
        >
          <Users className="h-8 w-8 mb-2" />
          <span className="text-lg font-medium">Manage Clients</span>
        </Link>

        <Link
          href="/admin/questionnaires"
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors"
        >
          <FileText className="h-8 w-8 mb-2" />
          <span className="text-lg font-medium">Questionnaires</span>
        </Link>

        <Link
          href="/admin/prompt-generator"
          className="bg-amber-600 hover:bg-amber-700 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors"
        >
          <Activity className="h-8 w-8 mb-2" />
          <span className="text-lg font-medium">Generate Plans</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Clients</h2>
            <Users className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{clientCount?.count || 0}</p>
          <div className="mt-4">
            <Link href="/admin/clients" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
              View all clients
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Questionnaires</h2>
            <FileText className="h-6 w-6 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{questionnairesWithNames.length}</p>
          <div className="mt-4">
            <Link
              href="/admin/questionnaires"
              className="text-green-400 hover:text-green-300 text-sm flex items-center"
            >
              Manage questionnaires
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Today</h2>
            <Calendar className="h-6 w-6 text-purple-400" />
          </div>
          <p className="text-lg text-white">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="mt-4">
            <Link href="/admin/calendar" className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
              View calendar
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Clients</h2>
          {recentClients && recentClients.length > 0 ? (
            <div className="space-y-4">
              {recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  className="block bg-gray-700 hover:bg-gray-600 rounded-md p-4 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-white">{client.name}</h3>
                      <p className="text-gray-300 text-sm">{client.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(client.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No clients found</p>
          )}
          <div className="mt-4 text-right">
            <Link href="/admin/clients" className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center">
              View all clients
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Questionnaires</h2>
          {questionnairesWithNames.length > 0 ? (
            <div className="space-y-4">
              {questionnairesWithNames.map((questionnaire) => (
                <Link
                  key={questionnaire.id}
                  href={`/admin/clients/${questionnaire.client_id}/questionnaires`}
                  className="block bg-gray-700 hover:bg-gray-600 rounded-md p-4 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-white">{questionnaire.clientName}</h3>
                      <p className="text-gray-300 text-sm">Questionnaire completed</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(questionnaire.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recent questionnaires</p>
          )}
          <div className="mt-4 text-right">
            <Link
              href="/admin/questionnaires"
              className="text-green-400 hover:text-green-300 text-sm inline-flex items-center"
            >
              View all questionnaires
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
