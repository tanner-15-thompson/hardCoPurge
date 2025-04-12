import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if clients table exists
    const { data: tableExists, error: tableCheckError } = await supabase.from("clients").select("id").limit(1)

    if (tableCheckError) {
      return NextResponse.json(
        {
          error: "Clients table does not exist. Please run database setup first.",
        },
        { status: 400 },
      )
    }

    // Insert test client with ID 1
    const { error: insertError } = await supabase.from("clients").upsert(
      [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "555-123-4567",
          created_at: new Date().toISOString(),
        },
      ],
      { onConflict: "id" },
    )

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Test client with ID 1 has been created or updated.",
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
