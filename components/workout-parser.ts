/**
 * Parses workout HTML to extract exercises and their details
 */
export function parseWorkoutHtml(html: string): {
  exercises: {
    name: string
    type: "strength" | "cardio" | "other"
    sets?: number
    reps?: string
    weight?: string
    duration?: string
    distance?: string
    pace?: string
    zone?: string
    section?: string
    description?: string
  }[]
} {
  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  const exercises: any[] = []
  let currentSection = ""

  // Define section patterns for better detection
  const warmupPattern = /warm[- ]?up|mobility|activation|prep|prepare|stretching|dynamic/i
  const mainPattern = /main|primary|workout a|first part|strength|power/i
  const auxPattern = /aux|accessory|secondary|workout b|second part|assistance|hypertrophy/i
  const cooldownPattern = /cool[- ]?down|recovery|stretching|mobility|flexibility|static stretch/i

  // First pass: try to find explicit section headers
  const headers = doc.querySelectorAll("h1, h2, h3, h4, h5, h6, strong, b, p strong, p b")
  headers.forEach((header) => {
    const text = header.textContent || ""

    // Check if this looks like a section header
    if (
      text.match(warmupPattern) ||
      text.match(mainPattern) ||
      text.match(auxPattern) ||
      text.match(cooldownPattern) ||
      text.match(/section|part/i) ||
      text.match(/\d+\s*min/i)
    ) {
      // Determine section type
      let sectionType = "Other"
      if (text.match(warmupPattern)) sectionType = "Warm-up"
      else if (text.match(mainPattern)) sectionType = "Main"
      else if (text.match(auxPattern)) sectionType = "Aux"
      else if (text.match(cooldownPattern)) sectionType = "Cool-down"

      // Extract time if present
      const timeMatch = text.match(/(\d+)\s*min/i)
      const timeStr = timeMatch ? ` (${timeMatch[1]} min)` : ""

      currentSection = `${sectionType}${timeStr}`

      // Look for exercises in the next sibling elements until we hit another header
      let nextElement = header.nextElementSibling
      while (nextElement && !nextElement.matches("h1, h2, h3, h4, h5, h6, strong, b")) {
        if (nextElement.tagName === "UL" || nextElement.tagName === "OL") {
          // Process list items
          const listItems = nextElement.querySelectorAll("li")
          listItems.forEach((item) => {
            const exercise = parseExerciseText(item.textContent || "", currentSection)
            if (exercise) {
              exercises.push(exercise)
            }
          })
        } else if (nextElement.tagName === "P" || nextElement.tagName === "DIV") {
          // Process paragraph text
          const paragraphText = nextElement.textContent || ""

          // Check if this paragraph contains multiple exercises separated by newlines or semicolons
          const exerciseTexts = paragraphText.split(/[\n;]+/)

          if (exerciseTexts.length > 1) {
            // Multiple exercises in one paragraph
            exerciseTexts.forEach((text) => {
              const trimmedText = text.trim()
              if (trimmedText.length > 3) {
                const exercise = parseExerciseText(trimmedText, currentSection)
                if (exercise) {
                  exercises.push(exercise)
                }
              }
            })
          } else {
            // Single exercise or description
            const exercise = parseExerciseText(paragraphText, currentSection)
            if (exercise) {
              exercises.push(exercise)
            }
          }

          // Also check for lists inside paragraphs
          const nestedLists = nextElement.querySelectorAll("ul, ol")
          nestedLists.forEach((list) => {
            const listItems = list.querySelectorAll("li")
            listItems.forEach((item) => {
              const exercise = parseExerciseText(item.textContent || "", currentSection)
              if (exercise) {
                exercises.push(exercise)
              }
            })
          })
        }
        nextElement = nextElement.nextElementSibling
      }
    }
  })

  // Second pass: if we didn't find explicit sections, look for implicit sections
  if (exercises.length === 0) {
    // Look for paragraphs that might contain section headers
    const paragraphs = doc.querySelectorAll("p")

    paragraphs.forEach((p, index) => {
      const text = p.textContent || ""

      // Check if this paragraph looks like a section header
      if (
        text.match(warmupPattern) ||
        text.match(mainPattern) ||
        text.match(auxPattern) ||
        text.match(cooldownPattern) ||
        text.match(/section|part/i) ||
        text.match(/\d+\s*min/i)
      ) {
        // Determine section type
        let sectionType = "Other"
        if (text.match(warmupPattern)) sectionType = "Warm-up"
        else if (text.match(mainPattern)) sectionType = "Main"
        else if (text.match(auxPattern)) sectionType = "Aux"
        else if (text.match(cooldownPattern)) sectionType = "Cool-down"

        // Extract time if present
        const timeMatch = text.match(/(\d+)\s*min/i)
        const timeStr = timeMatch ? ` (${timeMatch[1]} min)` : ""

        currentSection = `${sectionType}${timeStr}`

        // Look for exercises in the next paragraph
        if (index < paragraphs.length - 1) {
          const nextParagraph = paragraphs[index + 1]
          const nextText = nextParagraph.textContent || ""

          // Check if this paragraph contains multiple exercises
          const exerciseTexts = nextText.split(/[\n;]+/)

          exerciseTexts.forEach((exerciseText) => {
            const trimmedText = exerciseText.trim()
            if (trimmedText.length > 3) {
              const exercise = parseExerciseText(trimmedText, currentSection)
              if (exercise) {
                exercises.push(exercise)
              }
            }
          })
        }
      } else if (currentSection && text.length > 3) {
        // This might be an exercise in the current section
        const exercise = parseExerciseText(text, currentSection)
        if (exercise) {
          exercises.push(exercise)
        }
      }
    })
  }

  // Third pass: if we still don't have sections, try to find all list items
  if (exercises.length === 0) {
    // Find all list items that might contain exercises
    const listItems = doc.querySelectorAll("li")

    listItems.forEach((item) => {
      const text = item.textContent || ""
      const exercise = parseExerciseText(text, "")
      if (exercise) {
        exercises.push(exercise)
      }
    })

    // Also look for paragraphs that might contain exercises
    const paragraphs = doc.querySelectorAll("p")
    paragraphs.forEach((p) => {
      const text = p.textContent || ""
      // Skip very short paragraphs
      if (text.length < 10) return

      const exercise = parseExerciseText(text, "")
      if (exercise) {
        exercises.push(exercise)
      }
    })
  }

  // If we have exercises but no sections, categorize them
  if (exercises.length > 0 && !exercises.some((e) => e.section)) {
    // Attempt to categorize exercises into sections based on their order
    const totalExercises = exercises.length

    if (totalExercises >= 4) {
      // Simple heuristic: divide exercises into sections
      const warmupCount = Math.max(1, Math.floor(totalExercises * 0.2))
      const mainCount = Math.max(1, Math.floor(totalExercises * 0.4))
      const auxCount = Math.max(1, Math.floor(totalExercises * 0.3))

      exercises.forEach((exercise, index) => {
        if (index < warmupCount) {
          exercise.section = "Warm-up (5 min)"
        } else if (index < warmupCount + mainCount) {
          exercise.section = "Main (30 min)"
        } else if (index < warmupCount + mainCount + auxCount) {
          exercise.section = "Aux (15 min)"
        } else {
          exercise.section = "Cool-down (5 min)"
        }
      })
    }
  }

  // Ensure we have at least one exercise in each major section
  const sections = ["Warm-up", "Main", "Aux", "Cool-down"]
  const existingSections = new Set(
    exercises.map((e) => {
      const sectionName = e.section?.split(" ")[0]
      return sectionName
    }),
  )

  // Check which sections are missing
  sections.forEach((section) => {
    if (!existingSections.has(section)) {
      // Add default exercises for missing sections
      switch (section) {
        case "Warm-up":
          exercises.unshift({
            name: "Dynamic stretches",
            type: "other",
            description: "Arm circles, leg swings, hip rotations",
            section: "Warm-up (5 min)",
          })
          exercises.unshift({
            name: "Light cardio",
            type: "cardio",
            duration: "3 minutes",
            section: "Warm-up (5 min)",
          })
          break
        case "Cool-down":
          exercises.push({
            name: "Static stretches",
            type: "other",
            description: "Hold each stretch for 20-30 seconds",
            section: "Cool-down (5 min)",
          })
          exercises.push({
            name: "Deep breathing",
            type: "other",
            duration: "2 minutes",
            section: "Cool-down (5 min)",
          })
          break
      }
    }
  })

  return { exercises }
}

/**
 * Parse a text string to extract exercise details
 */
function parseExerciseText(text: string, section: string): any | null {
  // Skip empty or very short texts
  if (!text || text.length < 3) return null

  // Skip if this is clearly a section header
  if (text.match(/warm[- ]?up|main|aux|cool[- ]?down|section|part/i) && text.length < 30) {
    return null
  }

  // Strength exercise pattern: Name: sets x reps @ weight
  const strengthMatch = text.match(
    /([^:]+):\s*(\d+)\s*sets?\s*(?:of|x)\s*(\d+(?:-\d+)?)\s*reps?\s*(?:@|at)?\s*(\d+(?:\.\d+)?)\s*(?:lbs?|kg)?/i,
  )

  if (strengthMatch) {
    return {
      name: strengthMatch[1].trim(),
      type: "strength",
      sets: Number.parseInt(strengthMatch[2]),
      reps: strengthMatch[3],
      weight: strengthMatch[4] + " lbs",
      section,
    }
  }

  // Alternative strength pattern: Name - sets x reps @ weight
  const altStrengthMatch = text.match(
    /([^-]+)\s*-\s*(\d+)\s*(?:sets?|x)\s*(?:of|x)?\s*(\d+(?:-\d+)?)\s*reps?\s*(?:@|at)?\s*(\d+(?:\.\d+)?)\s*(?:lbs?|kg)?/i,
  )

  if (altStrengthMatch) {
    return {
      name: altStrengthMatch[1].trim(),
      type: "strength",
      sets: Number.parseInt(altStrengthMatch[2]),
      reps: altStrengthMatch[3],
      weight: altStrengthMatch[4] + " lbs",
      section,
    }
  }

  // Simple strength pattern: Name: sets x reps
  const simpleStrengthMatch = text.match(/([^:]+):\s*(\d+)\s*sets?\s*(?:of|x)\s*(\d+(?:-\d+)?)\s*reps?/i)

  if (simpleStrengthMatch) {
    return {
      name: simpleStrengthMatch[1].trim(),
      type: "strength",
      sets: Number.parseInt(simpleStrengthMatch[2]),
      reps: simpleStrengthMatch[3],
      section,
    }
  }

  // Very simple strength pattern: Name (sets x reps)
  const verySimpleStrengthMatch = text.match(/([^(]+)\s*$$\s*(\d+)\s*x\s*(\d+(?:-\d+)?)\s*$$/i)

  if (verySimpleStrengthMatch) {
    return {
      name: verySimpleStrengthMatch[1].trim(),
      type: "strength",
      sets: Number.parseInt(verySimpleStrengthMatch[2]),
      reps: verySimpleStrengthMatch[3],
      section,
    }
  }

  // Cardio exercise pattern: Run/Jog/etc: distance in time (zone)
  const cardioMatch = text.match(
    /(Run|Jog|Walk|Cycle|Swim|Row)(?:[^:]*):?\s*([\d.]+\s*(?:miles?|km|meters?))(?:\s*in\s*([\d:]+))?(?:\s*$$(?:Zone|Z)\s*(\d+)$$)?/i,
  )

  if (cardioMatch) {
    const result = {
      name: cardioMatch[1].trim(),
      type: "cardio" as const,
      distance: cardioMatch[2],
      duration: cardioMatch[3] || "",
      zone: cardioMatch[4] ? `Zone ${cardioMatch[4]}` : "",
      section,
    }

    // Try to extract pace if it exists
    const paceMatch = text.match(/(\d+:\d+)\s*(?:min\/mile|pace)/i)
    if (paceMatch) {
      result.pace = paceMatch[1]
    }

    return result
  }

  // Simple cardio pattern: Cardio exercise for duration
  const simpleCardioMatch = text.match(
    /(run|jog|walk|cycle|swim|row|cardio)(?:[^:]*)\s*for\s*(\d+(?:\.\d+)?)\s*(?:min(?:ute)?s?|sec(?:ond)?s?)/i,
  )

  if (simpleCardioMatch) {
    return {
      name: simpleCardioMatch[1].trim(),
      type: "cardio",
      duration: simpleCardioMatch[2] + (simpleCardioMatch[0].toLowerCase().includes("sec") ? " seconds" : " minutes"),
      section,
    }
  }

  // Duration-based exercise pattern: Name for duration
  const durationMatch = text.match(/([^:]+)(?::|for)\s*(\d+(?:\.\d+)?)\s*(?:min(?:ute)?s?|sec(?:ond)?s?)/i)

  if (durationMatch) {
    return {
      name: durationMatch[1].trim(),
      type: "other",
      duration: durationMatch[2] + (durationMatch[0].toLowerCase().includes("sec") ? " seconds" : " minutes"),
      section,
    }
  }

  // Stretching pattern: Stretch name (body part)
  const stretchMatch = text.match(/(stretch|mobility|flexibility)\s+([^(]+)(?:\s*$$([^)]+)$$)?/i)

  if (stretchMatch) {
    return {
      name: `${stretchMatch[1]} ${stretchMatch[2]}`.trim(),
      type: "other",
      description: stretchMatch[3] || "",
      section,
    }
  }

  // If we can't categorize it but it looks like an exercise, add it as "other"
  if (text.length > 5 && !text.toLowerCase().includes("min)") && text.match(/[A-Za-z]+/)) {
    // Try to extract just the exercise name if there's a colon
    const nameMatch = text.match(/([^:]+):/i)
    const name = nameMatch ? nameMatch[1].trim() : text.trim()

    // Try to extract a description if there's a colon
    const descMatch = text.match(/[^:]+:(.+)/i)
    const description = descMatch ? descMatch[1].trim() : undefined

    return {
      name,
      type: "other",
      section,
      description,
    }
  }

  return null
}
