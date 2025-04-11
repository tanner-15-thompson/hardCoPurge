import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { ClientHeaderNav } from "@/components/client-header-nav"
import { StripeSubscriptionSetup } from "@/components/stripe-subscription-setup"
import { StripeDebugInfo } from "@/components/stripe-debug-info"

export default async function ClientPaymentPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Validate that id is a number
    const clientId = Number.parseInt(params.id)
    if (isNaN(clientId)) {
      return notFound()
    }

    // Fetch client data
    const { data: client, error } = await supabase
      .from("clients")
      .select(
        "id, name, email, stripe_customer_id, stripe_subscription_id, payment_amount, payment_frequency, last_payment_date",
      )
      .eq("id", clientId)
      .single()

    if (error || !client) {
      console.error("Error fetching client:", error)
      return notFound()
    }

    return (
      <div>
        <ClientHeaderNav clientId={clientId} clientName={client.name} />

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h1 className="text-xl font-bold text-gray-800">{client.name} - Payment Management</h1>
          </div>

          <div className="p-6">
            {client.stripe_subscription_id ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Subscription Management</h2>
                <p className="mb-4">
                  This client already has an active subscription. You can manage their subscription through the Stripe
                  dashboard.
                </p>
                <a
                  href={`https://dashboard.stripe.com/subscriptions/${client.stripe_subscription_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manage in Stripe Dashboard
                </a>
              </div>
            ) : (
              <>
                <StripeSubscriptionSetup clientId={clientId} clientName={client.name} clientEmail={client.email} />
                <StripeDebugInfo />
              </>
            )}
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error in client payment page:", err)
    return notFound()
  }
}
