import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Use the latest API version
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    const { action, clientId, amount, interval, email, name } = body

    // Check if we have a valid action
    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 })
    }

    // Handle different actions
    switch (action) {
      case "create_customer":
        // Create a new Stripe customer
        const customer = await stripe.customers.create({
          email,
          name,
          metadata: {
            clientId: clientId.toString(),
          },
        })

        // Update the client record with the Stripe customer ID
        const { error: updateError } = await supabase
          .from("clients")
          .update({ stripe_customer_id: customer.id })
          .eq("id", clientId)

        if (updateError) {
          console.error("Error updating client with Stripe customer ID:", updateError)
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, customerId: customer.id })

      case "create_subscription":
        // Get the client to find their Stripe customer ID
        const { data: client, error: clientError } = await supabase
          .from("clients")
          .select("stripe_customer_id")
          .eq("id", clientId)
          .single()

        if (clientError || !client) {
          console.error("Error fetching client:", clientError)
          return NextResponse.json({ error: "Client not found" }, { status: 404 })
        }

        if (!client.stripe_customer_id) {
          return NextResponse.json({ error: "Client does not have a Stripe customer ID" }, { status: 400 })
        }

        try {
          // Create a product for this client's subscription
          const product = await stripe.products.create({
            name: `Fitness Subscription for ${name}`,
            metadata: {
              clientId: clientId.toString(),
            },
          })

          // Create a price for the product
          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(amount * 100), // Convert to cents
            currency: "usd",
            recurring: {
              interval: interval || "month", // 'month' or 'year'
            },
          })

          // Create a subscription
          const subscription = await stripe.subscriptions.create({
            customer: client.stripe_customer_id,
            items: [{ price: price.id }],
            payment_behavior: "default_incomplete",
            payment_settings: { save_default_payment_method: "on_subscription" },
            expand: ["latest_invoice.payment_intent"],
          })

          // Update the client record with subscription details
          const { error: subUpdateError } = await supabase
            .from("clients")
            .update({
              stripe_subscription_id: subscription.id,
              payment_amount: amount,
              payment_frequency: interval === "year" ? 12 : 1, // Convert to months
              last_payment_date: new Date().toISOString(),
            })
            .eq("id", clientId)

          if (subUpdateError) {
            console.error("Error updating client with subscription details:", subUpdateError)
            // Continue anyway, as the subscription was created in Stripe
          }

          // Get the client secret from the payment intent
          const invoice = subscription.latest_invoice as Stripe.Invoice
          const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

          if (!paymentIntent || !paymentIntent.client_secret) {
            throw new Error("Failed to get payment intent client secret")
          }

          console.log("Created subscription with client secret:", paymentIntent.client_secret)

          return NextResponse.json({
            success: true,
            subscriptionId: subscription.id,
            clientSecret: paymentIntent.client_secret,
          })
        } catch (error: any) {
          console.error("Error creating subscription:", error)
          return NextResponse.json({ error: error.message || "Failed to create subscription" }, { status: 500 })
        }

      case "get_payment_status":
        // Get the client to find their Stripe subscription ID
        const { data: subClient, error: subClientError } = await supabase
          .from("clients")
          .select("stripe_subscription_id")
          .eq("id", clientId)
          .single()

        if (subClientError || !subClient) {
          console.error("Error fetching client:", subClientError)
          return NextResponse.json({ error: "Client not found" }, { status: 404 })
        }

        if (!subClient.stripe_subscription_id) {
          return NextResponse.json({ error: "Client does not have a Stripe subscription" }, { status: 400 })
        }

        // Get the subscription details
        const subDetails = await stripe.subscriptions.retrieve(subClient.stripe_subscription_id)

        return NextResponse.json({
          success: true,
          status: subDetails.status,
          currentPeriodEnd: new Date(subDetails.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: subDetails.cancel_at_period_end,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error in Stripe API route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
