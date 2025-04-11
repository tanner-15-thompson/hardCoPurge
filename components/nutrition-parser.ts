/**
 * Parses nutrition plan HTML to extract meals and their details
 */
export function parseNutritionHtml(html: string): {
  meals: {
    name: string
    type: "breakfast" | "lunch" | "dinner" | "snack" | "other"
    calories?: number
    protein?: string
    carbs?: string
    fat?: string
    ingredients?: string[]
    instructions?: string
  }[]
} {
  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  const meals: any[] = []

  // First try to find meal sections by looking for h3 elements that might contain meal types
  const mealHeadings = doc.querySelectorAll("h3")

  mealHeadings.forEach((heading) => {
    const headingText = heading.textContent || ""
    if (
      headingText.toLowerCase().includes("breakfast") ||
      headingText.toLowerCase().includes("lunch") ||
      headingText.toLowerCase().includes("dinner") ||
      headingText.toLowerCase().includes("snack")
    ) {
      // This is likely a meal section heading
      const mealType = headingText.toLowerCase().includes("breakfast")
        ? "breakfast"
        : headingText.toLowerCase().includes("lunch")
          ? "lunch"
          : headingText.toLowerCase().includes("dinner")
            ? "dinner"
            : headingText.toLowerCase().includes("snack")
              ? "snack"
              : "other"

      // Look for meal items in the list that follows
      const nextElement = heading.nextElementSibling
      if (nextElement && nextElement.tagName === "UL") {
        const mealItems = nextElement.querySelectorAll("li")
        mealItems.forEach((item, index) => {
          const mealText = item.textContent || ""

          // Try to extract nutritional info if available
          const calorieMatch = mealText.match(/(\d+)\s*(?:kcal|calories)/i)
          const proteinMatch = mealText.match(/(\d+)g\s*protein/i)
          const carbsMatch = mealText.match(/(\d+)g\s*carbs/i)
          const fatMatch = mealText.match(/(\d+)g\s*fat/i)

          // Extract ingredients if available
          const ingredients = mealText.split(",").map((item) => item.trim())

          meals.push({
            name: mealText.split(":")[0] || `${headingText} Option ${index + 1}`,
            type: mealType,
            calories: calorieMatch ? Number.parseInt(calorieMatch[1]) : undefined,
            protein: proteinMatch ? `${proteinMatch[1]}g` : undefined,
            carbs: carbsMatch ? `${carbsMatch[1]}g` : undefined,
            fat: fatMatch ? `${fatMatch[1]}g` : undefined,
            ingredients: ingredients.length > 1 ? ingredients : undefined,
          })
        })
      }
    }
  })

  // If no meals were found using the heading approach, fall back to the original method
  if (meals.length === 0) {
    // Find all list items that might contain meals
    const listItems = doc.querySelectorAll("li")

    listItems.forEach((item) => {
      const text = item.textContent || ""

      // Skip non-meal items
      if (!text.includes(":")) {
        return
      }

      // Try to extract meal information
      const mealMatch = text.match(/([^:]+):\s*(.+)/)

      if (mealMatch) {
        const mealType = mealMatch[1].trim().toLowerCase()
        const mealContent = mealMatch[2].trim()

        let type: "breakfast" | "lunch" | "dinner" | "snack" | "other" = "other"

        if (mealType.includes("breakfast")) {
          type = "breakfast"
        } else if (mealType.includes("lunch")) {
          type = "lunch"
        } else if (mealType.includes("dinner")) {
          type = "dinner"
        } else if (mealType.includes("snack")) {
          type = "snack"
        }

        // Try to extract calorie information if available
        const calorieMatch = mealContent.match(/(\d+)\s*(?:kcal|calories)/i)
        const calories = calorieMatch ? Number.parseInt(calorieMatch[1]) : undefined

        // Try to extract macros if available
        const proteinMatch = mealContent.match(/(\d+)g\s*protein/i)
        const carbsMatch = mealContent.match(/(\d+)g\s*carbs/i)
        const fatMatch = mealContent.match(/(\d+)g\s*fat/i)

        meals.push({
          name: mealType,
          type,
          calories,
          protein: proteinMatch ? `${proteinMatch[1]}g` : undefined,
          carbs: carbsMatch ? `${carbsMatch[1]}g` : undefined,
          fat: fatMatch ? `${fatMatch[1]}g` : undefined,
          ingredients: mealContent.split(",").map((item) => item.trim()),
        })
      }
    })
  }

  return { meals }
}
