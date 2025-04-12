import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { ClientHeaderNav } from "@/components/client-header-nav"
import { PromptGenerator } from "@/components/prompt-generator"
import { ClientPaymentStatus } from "@/components/client-payment-status"
import { ClientDetailContent } from "@/components/client-detail-content"

export default async function ClientDashboardPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      return (
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl" role="alert">
            <p className="font-medium">Invalid client ID</p>
            <p className="text-sm mt-1">Please check the URL and try again.</p>
          </div>
        </div>
      )
    }

    // Fetch client data
    const { data: client, error } = await supabase
      .from("clients")
      .select(
        "id, name, email, phone, stripe_customer_id, last_payment_date, payment_amount, payment_frequency, created_at",
      )
      .eq("id", clientId)
      .single()

    if (error) {
      console.error("Error fetching client:", error)
      return notFound()
    }

    return (
      <div>
        <ClientHeaderNav clientId={clientId} clientName={client.name} />

        <div className="container mx-auto py-8">
          <ClientDetailContent clientId={clientId} clientData={client} />
          <ClientPaymentStatus
            clientId={clientId}
            stripeSubscriptionId={client.stripe_customer_id}
            lastPaymentDate={client.last_payment_date}
            paymentAmount={client.payment_amount}
            paymentFrequency={client.payment_frequency}
          />
          <PromptGenerator clientId={clientId} clientName={client.name} />
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in client dashboard page:", err)
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl"
          role="alert"
        >
          <p className="font-medium">An error occurred</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      </div>
    )
  }
}
