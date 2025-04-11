import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Get the admin password from the query string
    const { searchParams } = new URL(request.url)
    const password = searchParams.get("password")

    // Check if the password matches the admin password
    if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "database", "questionnaire-migration.sql")
    const sql = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Questionnaire tables created successfully" })
  } catch (error) {
    console.error("Error in setup-questionnaire route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
