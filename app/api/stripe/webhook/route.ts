import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerSupabaseClient } from "@/lib/supabase"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const body = await request.text()
  const sig = request.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret!)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      const customerId = subscription.customer as string

      // Find the client with this Stripe customer ID
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single()

      if (clientError || !client) {
        console.error("Error finding client with Stripe customer ID:", customerId)
        break
      }

      // Update the client's last payment date
      const { error: updateError } = await supabase
        .from("clients")
        .update({
          last_payment_date: new Date().toISOString(),
          payment_status: "paid",
        })
        .eq("id", client.id)

      if (updateError) {
        console.error("Error updating client payment date:", updateError)
      }

      // Add a payment record
      const { error: paymentError } = await supabase.from("client_payments").insert({
        client_id: client.id,
        amount: invoice.amount_paid / 100, // Convert from cents
        payment_date: new Date().toISOString(),
        stripe_invoice_id: invoice.id,
        stripe_payment_intent_id: invoice.payment_intent as string,
        status: "succeeded",
      })

      if (paymentError) {
        console.error("Error recording payment:", paymentError)
      }

      break

    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice
      const failedSubscription = await stripe.subscriptions.retrieve(failedInvoice.subscription as string)
      const failedCustomerId = failedSubscription.customer as string

      // Find the client with this Stripe customer ID
      const { data: failedClient, error: failedClientError } = await supabase
        .from("clients")
        .select("id")
        .eq("stripe_customer_id", failedCustomerId)
        .single()

      if (failedClientError || !failedClient) {
        console.error("Error finding client with Stripe customer ID:", failedCustomerId)
        break
      }

      // Update the client's payment status
      const { error: failedUpdateError } = await supabase
        .from("clients")
        .update({
          payment_status: "failed",
        })
        .eq("id", failedClient.id)

      if (failedUpdateError) {
        console.error("Error updating client payment status:", failedUpdateError)
      }

      // Add a failed payment record
      const { error: failedPaymentError } = await supabase.from("client_payments").insert({
        client_id: failedClient.id,
        amount: failedInvoice.amount_due / 100, // Convert from cents
        payment_date: new Date().toISOString(),
        stripe_invoice_id: failedInvoice.id,
        stripe_payment_intent_id: failedInvoice.payment_intent as string,
        status: "failed",
      })

      if (failedPaymentError) {
        console.error("Error recording failed payment:", failedPaymentError)
      }

      break

    case "customer.subscription.updated":
      const updatedSubscription = event.data.object as Stripe.Subscription
      const updatedCustomerId = updatedSubscription.customer as string

      // Find the client with this Stripe customer ID
      const { data: updatedClient, error: updatedClientError } = await supabase
        .from("clients")
        .select("id")
        .eq("stripe_customer_id", updatedCustomerId)
        .single()

      if (updatedClientError || !updatedClient) {
        console.error("Error finding client with Stripe customer ID:", updatedCustomerId)
        break
      }

      // Update the client's subscription status
      const { error: updatedSubError } = await supabase
        .from("clients")
        .update({
          subscription_status: updatedSubscription.status,
          subscription_current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
          subscription_cancel_at_period_end: updatedSubscription.cancel_at_period_end,
        })
        .eq("id", updatedClient.id)

      if (updatedSubError) {
        console.error("Error updating client subscription status:", updatedSubError)
      }

      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

export const GET = async () => {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
