import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  try {
    // Verify admin authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const clientId = formData.get("clientId") as string
    const promptType = formData.get("promptType") as string
    const customInstructions = formData.get("customInstructions") as string

    // Fetch client data to use in prompt
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("name, goals, fitness_level, health_conditions, dietary_restrictions")
      .eq("id", clientId)
      .single()

    if (clientError) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Generate prompt based on type
    let promptContent = ""
    let promptTitle = ""

    switch (promptType) {
      case "workout":
        promptTitle = `Workout Plan for ${client.name}`
        promptContent = generateWorkoutPrompt(client, customInstructions)
        break
      case "nutrition":
        promptTitle = `Nutrition Plan for ${client.name}`
        promptContent = generateNutritionPrompt(client, customInstructions)
        break
      case "motivation":
        promptTitle = `Motivation Message for ${client.name}`
        promptContent = generateMotivationPrompt(client, customInstructions)
        break
      case "progress":
        promptTitle = `Progress Assessment for ${client.name}`
        promptContent = generateProgressPrompt(client, customInstructions)
        break
      default:
        promptTitle = `Custom Prompt for ${client.name}`
        promptContent = `Create a personalized plan for ${client.name}.\n\n${customInstructions}`
    }

    // Save the generated prompt
    const { data: prompt, error: promptError } = await supabase
      .from("generated_prompts")
      .insert({
        client_id: clientId,
        prompt_type: promptType,
        title: promptTitle,
        content: promptContent,
        created_by: session.user.id,
      })
      .select()
      .single()

    if (promptError) {
      console.error("Error saving prompt:", promptError)
      return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 })
    }

    // Log the activity
    await supabase.from("activity_logs").insert({
      client_id: clientId,
      activity_type: "Prompt Generated",
      description: `Generated a ${promptType} prompt: ${promptTitle}`,
      created_by: session.user.id,
    })

    return NextResponse.json({
      success: true,
      prompt: {
        id: prompt.id,
        title: promptTitle,
        content: promptContent,
      },
    })
  } catch (error) {
    console.error("Error generating prompt:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Helper functions to generate different types of prompts
function generateWorkoutPrompt(client: any, customInstructions: string) {
  return `Create a personalized workout plan for ${client.name} with the following details:

Client Information:
- Fitness Level: ${client.fitness_level || "Not specified"}
- Goals: ${client.goals || "Not specified"}
- Health Conditions: ${client.health_conditions || "None"}

The workout plan should include:
1. Weekly schedule with specific exercises
2. Sets, reps, and rest periods for each exercise
3. Warm-up and cool-down routines
4. Progressive overload strategy
5. Modifications based on health conditions

${customInstructions ? `Additional Instructions: ${customInstructions}` : ""}`
}

function generateNutritionPrompt(client: any, customInstructions: string) {
  return `Create a personalized nutrition plan for ${client.name} with the following details:

Client Information:
- Fitness Level: ${client.fitness_level || "Not specified"}
- Goals: ${client.goals || "Not specified"}
- Dietary Restrictions: ${client.dietary_restrictions || "None"}

The nutrition plan should include:
1. Daily caloric targets
2. Macronutrient breakdown
3. Meal timing recommendations
4. Sample meal plans for 7 days
5. Hydration guidelines
6. Supplement recommendations (if appropriate)

${customInstructions ? `Additional Instructions: ${customInstructions}` : ""}`
}

function generateMotivationPrompt(client: any, customInstructions: string) {
  return `Create a personalized motivation message for ${client.name} with the following details:

Client Information:
- Fitness Level: ${client.fitness_level || "Not specified"}
- Goals: ${client.goals || "Not specified"}

The motivation message should:
1. Be encouraging and supportive
2. Reference their specific goals
3. Acknowledge challenges they might be facing
4. Provide actionable motivation tips
5. Include a memorable quote or mantra

${customInstructions ? `Additional Instructions: ${customInstructions}` : ""}`
}

function generateProgressPrompt(client: any, customInstructions: string) {
  return `Create a progress assessment framework for ${client.name} with the following details:

Client Information:
- Fitness Level: ${client.fitness_level || "Not specified"}
- Goals: ${client.goals || "Not specified"}
- Health Conditions: ${client.health_conditions || "None"}

The progress assessment should include:
1. Key metrics to track based on their goals
2. Recommended assessment frequency
3. Benchmarks for success at different stages
4. Methods to track subjective improvements
5. Strategies to adjust plans based on progress

${customInstructions ? `Additional Instructions: ${customInstructions}` : ""}`
}
