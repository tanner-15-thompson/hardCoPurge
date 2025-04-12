import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // SQL to add new columns
    const sql = `
    -- Add new fields to clients table
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10, 2);
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_frequency INTEGER; -- in months
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE;
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;

    -- Create client_documents table if it doesn't exist
    CREATE TABLE IF NOT EXISTS client_documents (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT,
      file_size INTEGER,
      uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      description TEXT
    );

    -- Create index for faster lookups
    CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
    `

    // Execute the SQL directly using a query
    // Since we can't use exec_sql, we'll split the SQL into individual statements
    const statements = sql.split(";").filter((stmt) => stmt.trim().length > 0)

    for (const statement of statements) {
      const { error } = await supabase.rpc("run_sql", {
        sql_statement: statement.trim() + ";",
      })

      if (error) {
        console.error("Error executing SQL:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Could not execute SQL. Please run it manually in the Supabase SQL Editor.",
            sql: sql,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Client fields migration completed successfully. You can now refresh the page to see the updated client details.",
    })
  } catch (error: any) {
    console.error("Error in setup-client-fields route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        sql: `
-- Add new fields to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10, 2);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_frequency INTEGER; -- in months
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create client_documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_documents (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
      `,
      },
      { status: 500 },
    )
  }
}

// Also support POST for form submissions
export { GET as POST }
