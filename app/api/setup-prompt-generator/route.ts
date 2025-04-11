import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Verify admin authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "database", "prompt-generator-migration.sql")
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql: sqlContent })

    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ error: "Failed to execute SQL migration" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Prompt generator tables created successfully",
    })
  } catch (error) {
    console.error("Error setting up prompt generator:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
