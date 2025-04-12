import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Create client_workouts table if it doesn't exist
    const { error: workoutsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS client_workouts (
          id SERIAL PRIMARY KEY,
          client_id INTEGER NOT NULL,
          workout_html TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (workoutsError) {
      console.error("Error creating client_workouts table:", workoutsError)
      return NextResponse.json({ error: workoutsError.message }, { status: 500 })
    }

    // Create workout_completions table if it doesn't exist
    const { error: completionsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS workout_completions (
          id SERIAL PRIMARY KEY,
          client_id INTEGER NOT NULL,
          workout_id TEXT NOT NULL,
          completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (completionsError) {
      console.error("Error creating workout_completions table:", completionsError)
      return NextResponse.json({ error: completionsError.message }, { status: 500 })
    }

    // Create workout_logs table if it doesn't exist
    const { error: logsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS workout_logs (
          id SERIAL PRIMARY KEY,
          client_id INTEGER NOT NULL,
          workout_id TEXT NOT NULL,
          exercise_name TEXT NOT NULL,
          sets INTEGER,
          reps INTEGER,
          weight NUMERIC,
          notes TEXT,
          logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (logsError) {
      console.error("Error creating workout_logs table:", logsError)
      return NextResponse.json({ error: logsError.message }, { status: 500 })
    }

    // Create client_nutrition_plans table if it doesn't exist
    const { error: nutritionError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS client_nutrition_plans (
          id SERIAL PRIMARY KEY,
          client_id INTEGER NOT NULL,
          nutrition_html TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (nutritionError) {
      console.error("Error creating client_nutrition_plans table:", nutritionError)
      return NextResponse.json({ error: nutritionError.message }, { status: 500 })
    }

    // Create meal_completions table if it doesn't exist
    const { error: mealCompletionsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS meal_completions (
          id SERIAL PRIMARY KEY,
          client_id INTEGER NOT NULL,
          day_id TEXT NOT NULL,
          meal_id TEXT NOT NULL,
          completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (mealCompletionsError) {
      console.error("Error creating meal_completions table:", mealCompletionsError)
      return NextResponse.json({ error: mealCompletionsError.message }, { status: 500 })
    }

    // Create client_documents table if it doesn't exist
    const { error: documentsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS client_documents (
          id SERIAL PRIMARY KEY,
          client_id INTEGER NOT NULL,
          file_name TEXT NOT NULL,
          file_url TEXT NOT NULL,
          file_type TEXT NOT NULL,
          uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (documentsError) {
      console.error("Error creating client_documents table:", documentsError)
      return NextResponse.json({ error: documentsError.message }, { status: 500 })
    }

    // Check if execute_sql function exists, if not create it
    const { error: checkFunctionError } = await supabase.rpc("execute_sql", {
      sql_query: "SELECT 1;",
    })

    if (checkFunctionError && checkFunctionError.message.includes("function execute_sql() does not exist")) {
      // Create the execute_sql function
      const { error: createFunctionError } = await supabase.query(`
        CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
        RETURNS VOID AS $
        BEGIN
          EXECUTE sql_query;
        END;
        $ LANGUAGE plpgsql SECURITY DEFINER;
      `)

      if (createFunctionError) {
        console.error("Error creating execute_sql function:", createFunctionError)
        return NextResponse.json({ error: createFunctionError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: "Database tables created successfully" })
  } catch (error: any) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
