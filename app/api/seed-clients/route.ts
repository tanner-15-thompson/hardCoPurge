import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Insert a test client with ID 1
    const { error } = await supabase.from("clients").upsert(
      {
        id: 1,
        name: "Test Client",
        email: "test@example.com",
        phone: "555-123-4567",
        created_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, message: "Test client created successfully" })
  } catch (error: any) {
    console.error("Error seeding clients:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
