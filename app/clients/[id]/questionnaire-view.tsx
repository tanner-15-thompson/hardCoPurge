"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutDisplay } from "@/components/workout-display"
import { PDFWorkoutUploader } from "@/components/pdf-workout-uploader"

// Replace the existing PROMPT_TEMPLATE with the exact template provided
const PROMPT_TEMPLATE = `<div> <h1>HARD Workout Plan</h1> <p><strong>Important:</strong> Before using this prompt, replace all placeholders in square brackets (e.g., <code>[CLIENT NAME]</code>) with your client's specific information. Once completed, copy the entire prompt and paste it into Grok to generate the workout plan.</p> <h2>Instructions for User</h2> <p>Fill in the blanks below with your client's answers from the call (e.g., replace <code>[CLIENT NAME]</code> with "Tanner Thompson"). For the most accurate and effective plan, ensure that all details, especially "Current Stats or Benchmarks," are precise and reflect maximum effort values (e.g., 1RM for weights, fastest times for running). Once completed, copy this entire prompt and paste it into Grok to generate a 31-day workout plan with a multi-phase overview—expect a fully detailed, scientifically crafted masterpiece delivered in one complete output!</p> <h2>Client Questionnaire</h2> <p>Fill in the following details to customize the workout plan:</p> <ul> <li>Client Name: <code>[CLIENT NAME]</code></li> <li>Primary Fitness Goal: <code>[PRIMARY FITNESS GOAL]</code> (e.g., run a marathon, squat 200 lbs, lose 10 lbs)</li> <li>Specific Event or Deadline: <code>[SPECIFIC EVENT OR DEADLINE]</code> (e.g., race on March 15)</li> <li>Secondary Goals: <code>[SECONDARY GOALS]</code> (e.g., improve flexibility, build endurance)</li> <li>Current Fitness Level: <code>[CURRENT FITNESS LEVEL]</code> (beginner, intermediate, advanced)</li> <li>Training Experience: <code>[TRAINING EXPERIENCE]</code> (e.g., 2 years lifting, 1 year running)</li> <li>Current Stats or Benchmarks: <code>[CURRENT STATS OR BENCHMARKS]</code> (e.g., squat 1RM: 150 lbs, 3-mile best time: 25 min)<br> <strong>Note:</strong> Please provide maximum effort values: 1RM for weights and fastest times for running.</li> <li>Current Body Composition or Weight: <code>[CURRENT BODY COMPOSITION OR WEIGHT]</code> (optional, for hypertrophy/weight goals)</li> <li>Preferred Training Method or Style: <code>[PREFERRED TRAINING METHOD OR STYLE]</code> (e.g., strength, endurance, CrossFit, yoga)</li> <li>Training Days per Week: <code>[TRAINING DAYS PER WEEK]</code> (e.g., 3, 5, 7)</li> <li>Ideal Workout Duration: <code>[IDEAL WORKOUT DURATION]</code> (e.g., 30 min, 60 min, 90 min)</li> <li>Special Skills or Focus Exercises: <code>[SPECIAL SKILLS OR FOCUS EXERCISES]</code> (e.g., handstands, Olympic lifts)</li> <li>Injuries or Physical Limitations: <code>[INJURIES OR PHYSICAL LIMITATIONS]</code> (e.g., knee pain, shoulder impingement)</li> <li>Exercises You Cannot Perform: <code>[EXERCISES YOU CANNOT PERFORM]</code> (e.g., no running, no heavy squats)</li> <li>Equipment Access: <code>[EQUIPMENT ACCESS]</code> (e.g., full gym, dumbbells only, bodyweight)</li> <li>Time Constraints or Scheduling Preferences: <code>[TIME CONSTRAINTS OR SCHEDULING PREFERENCES]</code> (e.g., mornings only, 45 min max)</li> <li>Main Motivation: <code>[MAIN MOTIVATION]</code> (e.g., progress, competition, health)</li> <li>Challenges in Sticking to a Plan: <code>[CHALLENGES IN STICKING TO A PLAN]</code> (e.g., time, boredom, plateaus)</li> <li>Preferred Progress Tracking Method: <code>[PREFERRED PROGRESS TRACKING METHOD]</code> (e.g., weight lifted, run times, photos)</li> <li>Start Date: <code>[START DATE]</code> (optional, defaults to today)</li> </ul> <h2>Instructions for AI</h2> <p>Using the client's answers above, generate a complete 31-day HARD Workout Plan tailored to <code>[CLIENT NAME]</code>'s goals, fitness level, preferences, and constraints. This is Phase 1 (Weeks 1–4) of a multi-phase program leading up to <code>[SPECIFIC EVENT OR DEADLINE]</code> (or <code>[DEADLINE/EVENT DATE]</code> if provided). The plan should start on <code>[START DATE]</code> (or today if blank) and end 31 days later, with day 31 as rest/test.</p> **Output Formatting Instruction** <p><strong>Critical for AI:</strong> The entire 31-day workout plan must be generated in HTML format. Use the following HTML tags to structure the output:</p> <ul> <li><code>&lt;h2&gt;</code> for section headings (e.g., Plan Overview, Goal-Specific Guidance, Daily Plan)</li> <li><code>&lt;h3&gt;</code> for day headings (e.g., Day 1: [Date] - [Training Type])</li> <li><code>&lt;p&gt;</code> for paragraphs (e.g., instructions, notes)</li> <li><code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code> for lists of exercises, with each exercise as an <code>&lt;li&gt;</code> item</li> </ul> <p>Enclose the entire plan within a <code>&lt;div&gt;</code> tag for easy integration into a website. Here's an example of how a single day should look:</p> <pre> &lt;h3&gt;Day 1: [Date] ([Day of Week]) - [Training Type]&lt;/h3&gt; &lt;ul&gt; &lt;li&gt;&lt;strong&gt;Warm-up (5 min):&lt;/strong&gt; [Exercises]&lt;/li&gt; &lt;li&gt;&lt;strong&gt;Main ([Time] min):&lt;/strong&gt; [Exercises with sets/reps/weight/time]&lt;/li&gt; &lt;li&gt;&lt;strong&gt;Aux ([Time] min):&lt;/strong&gt; [Exercises with sets/reps/weight/time]&lt;/li&gt; &lt;li&gt;&lt;strong&gt;Cool-down (5 min):&lt;/strong&gt; [Stretches]&lt;/li&gt; &lt;/ul&gt; </pre> <h3>Critical Requirement</h3> <p>Generate the entire 31-day plan in one complete output. All 31 days must be fully detailed, with each day unique in its combination of exercises (while allowing strategic repetition of key exercises as noted below). Include warm-up, main, aux, and cool-down sections for every training day—no summaries, abbreviations, or skipped days. Every day must be fully spelled out with specific exercises, sets, reps, weights, or times as applicable.</p> <h3>Key Directives</h3> <ul> <li><strong>Goals</strong>: Use <code>[PRIMARY FITNESS GOAL]</code> and <code>[SECONDARY GOALS]</code> to set measurable targets (e.g., for strength: squat 200 lbs; for endurance: run 3 miles in 21 min).</li> <li><strong>Stats</strong>: <ul> <li>If <code>[CURRENT STATS OR BENCHMARKS]</code> are provided, treat them as maximum effort values: <ul> <li>For weights: assume they are 1RM (one-rep max) (e.g., squat 1RM: 150 lbs).</li> <li>For running or endurance: assume they are fastest times (e.g., 3-mile best time: 25 min).</li> </ul> </li> <li>If no stats are provided, estimate based on <code>[CURRENT FITNESS LEVEL]</code> and <code>[TRAINING EXPERIENCE]</code> (e.g., beginner strength: squat 1RM ~100 lbs).</li> </ul> </li> <li><strong>Preferences</strong>: Tailor the plan to <code>[PREFERRED TRAINING METHOD OR STYLE]</code>, <code>[TRAINING DAYS PER WEEK]</code>, and <code>[IDEAL WORKOUT DURATION]</code>.</li> <li><strong>Constraints</strong>: Adapt for <code>[INJURIES OR PHYSICAL LIMITATIONS]</code>, <code>[EXERCISES YOU CANNOT PERFORM]</code>, and <code>[EQUIPMENT ACCESS]</code>.</li> <li><strong>Motivations</strong>: Include elements that align with <code>[MAIN MOTIVATION]</code> and address <code>[CHALLENGES IN STICKING TO A PLAN]</code> (e.g., variety for boredom).</li> <li><strong>Progress</strong>: Use <code>[PREFERRED PROGRESS TRACKING METHOD]</code> to suggest tracking (e.g., log weights, take photos).</li> <li><strong>Strategic Repetition</strong>: Repeat 1–2 key exercises weekly (e.g., squats for strength, long runs for endurance) for mastery, while keeping auxiliary exercises varied.</li> <li><strong>Running Workouts with Pace and Zones</strong>: <p>For running workouts, always include both pace and zone, with the more important metric for that day's training focus listed first, followed by the secondary metric in parentheses.</p> <p>Determine the primary metric based on the day's training type:</p> <ul> <li><strong>Pace is primary for</strong>: Speed work (e.g., intervals, hill sprints), race-specific training (e.g., tempo runs, time trials). Example: "Run 6x400m at 1:30 pace (Zone 4)."</li> <li><strong>Zone is primary for</strong>: Endurance runs (e.g., long runs, easy runs), recovery runs, general fitness or base-building days. Example: "Run 10 miles in Zone 2 (9:00 min/mile pace)."</li> </ul> <p>Calculate or estimate pace and zone as follows:</p> <ul> <li><strong>Pace</strong>: Based on <code>[CURRENT STATS OR BENCHMARKS]</code> or estimated from <code>[CURRENT FITNESS LEVEL]</code> and <code>[TRAINING EXPERIENCE]</code>.</li> <li><strong>Zone</strong>: Based on heart rate (e.g., Zone 2: 60–70% max heart rate) or perceived exertion (e.g., Zone 2: "can talk easily").</li> <li>If <code>[CURRENT STATS OR BENCHMARKS]</code> include a maximum heart rate (MHR) or recent race time, use those to calculate zones.</li> <li>If not provided, estimate zones based on <code>[CURRENT FITNESS LEVEL]</code> and <code>[TRAINING EXPERIENCE]</code>: <ul> <li>Beginner: Zone 2 (60–70% MHR), Zone 4 (80–90% MHR)</li> <li>Intermediate: Zone 2 (65–75% MHR), Zone 4 (85–90% MHR)</li> <li>Advanced: Zone 2 (70–80% MHR), Zone 4 (90–95% MHR)</li> </ul> </li> </ul> </li> </ul> <h2>Output Format</h2> <p><strong>Plan Overview</strong>:</p> <ul> <li>Client: <code>[CLIENT NAME]</code></li> <li>Start Date: <code>[START DATE]</code></li> <li>End Date (Phase 1): <code>[END DATE]</code></li> <li>Goal: <code>[PRIMARY FITNESS GOAL]</code></li> <li>Training Days: <code>[TRAINING DAYS PER WEEK]</code></li> <li>Focus: <code>[PREFERRED TRAINING METHOD OR STYLE]</code></li> <li>Timeline: <code>[weeks]</code> to <code>[SPECIFIC EVENT OR DEADLINE]</code>; multi phases</li> <li>Phase 1 Targets: <code>[e.g., "Run 5 miles at 8:30 min/mile pace (Zone 2)"]</code></li> </ul> <p><strong>Goal-Specific Guidance</strong>:</p> <ul> <li><code>[Tailored paragraph based on PRIMARY FITNESS GOAL, e.g., "For marathon training, we'll prioritize Zone 2 for long runs and pace for speed sessions."]</code></li> <li><code>[Optional sentence on SECONDARY GOALS, if applicable.]</code></li> </ul> <p><strong>Daily Plan</strong>:</p> <ul> <li>Day X: <code>[DATE]</code> (<code>[DAY OF WEEK]</code>) - Training <ul> <li>Warm-up (5 min): <code>[Exercises]</code></li> <li>Main (<code>[20–40]</code> min): <code>[Exercises with sets/reps/weight/time, e.g., "Run 6 miles in Zone 2 (9:00 min/mile pace)"]</code></li> <li>Aux (<code>[20–60]</code> min): <code>[Exercises with sets/reps/weight/time]</code></li> <li>Cool-down (5 min): <code>[Stretches]</code></li> </ul> </li> <li>OR Day X: <code>[DATE]</code> (<code>[DAY OF WEEK]</code>) - Rest <ul> <li>No training</li> </ul> </li> </ul> <p>Progression Notes: <code>[e.g., "Increase Zone 2 run distance by 1 mile every 2 weeks"]</code></p> <p>Motivational Tip: <code>[e.g., "Consistency is key—trust the process!"]</code></p> <h2>Final Note for AI</h2> <p>Generate the entire 31-day plan in this single output, fully formatted in HTML as specified in the "Output Formatting Instruction" section. Every day must be fully detailed and unique, with no truncation, omissions, or partial delivery. The complete 31-day plan must be provided here and now.</p> </div>`

// Now modify the generatePrompt function to properly replace placeholders with client data
// const generatePrompt = () => {
//   if (!questionnaire) return

//   let prompt = PROMPT_TEMPLATE

//   // Replace all placeholders with actual values
//   prompt = prompt.replace(/\[CLIENT NAME\]/g, questionnaire.name || "")
//   prompt = prompt.replace(/\[PRIMARY FITNESS GOAL\]/g, questionnaire.goals || "")
//   prompt = prompt.replace(/\[SPECIFIC EVENT OR DEADLINE\]/g, questionnaire.specific_event || "")
//   prompt = prompt.replace(/\[SECONDARY GOALS\]/g, questionnaire.secondary_goals || "")
//   prompt = prompt.replace(/\[CURRENT FITNESS LEVEL\]/g, questionnaire.fitness_level || "")
//   prompt = prompt.replace(/\[TRAINING EXPERIENCE\]/g, questionnaire.training_experience || "")
//   prompt = prompt.replace(/\[CURRENT STATS OR BENCHMARKS\]/g, questionnaire.stats || "")
//   prompt = prompt.replace(/\[CURRENT BODY COMPOSITION OR WEIGHT\]/g, questionnaire.body_composition || "")
//   prompt = prompt.replace(/\[PREFERRED TRAINING METHOD OR STYLE\]/g, questionnaire.training_style || "")
//   prompt = prompt.replace(/\[TRAINING DAYS PER WEEK\]/g, questionnaire.days_per_week?.toString() || "")
//   prompt = prompt.replace(/\[IDEAL WORKOUT DURATION\]/g, questionnaire.workout_duration || "")
//   prompt = prompt.replace(/\[SPECIAL SKILLS OR FOCUS EXERCISES\]/g, questionnaire.special_skills || "")
//   prompt = prompt.replace(/\[INJURIES OR PHYSICAL LIMITATIONS\]/g, questionnaire.injuries || "")
//   prompt = prompt.replace(/\[EXERCISES YOU CANNOT PERFORM\]/g, questionnaire.exercises_to_avoid || "")
//   prompt = prompt.replace(/\[EQUIPMENT ACCESS\]/g, questionnaire.equipment || "")
//   prompt = prompt.replace(/\[TIME CONSTRAINTS OR SCHEDULING PREFERENCES\]/g, questionnaire.time_constraints || "")
//   prompt = prompt.replace(/\[MAIN MOTIVATION\]/g, questionnaire.motivation || "")
//   prompt = prompt.replace(/\[CHALLENGES IN STICKING TO A PLAN\]/g, questionnaire.challenges || "")
//   prompt = prompt.replace(/\[PREFERRED PROGRESS TRACKING METHOD\]/g, questionnaire.progress_tracking || "")
//   prompt = prompt.replace(/\[START DATE\]/g, questionnaire.start_date || "")

//   // Calculate end date (31 days after start date)
//   if (questionnaire.start_date) {
//     const startDate = new Date(questionnaire.start_date)
//     const endDate = new Date(startDate)
//     endDate.setDate(startDate.getDate() + 30) // 31 days total (start date + 30)
//     const endDateString = endDate.toISOString().split("T")[0]
//     prompt = prompt.replace(/\[END DATE\]/g, endDateString)
//   } else {
//     prompt = prompt.replace(/\[END DATE\]/g, "31 days after start")
//   }

//   setGeneratedPrompt(prompt)
// }

export default function QuestionnaireView({ questionnaire, clientId }: { questionnaire: any; clientId: number }) {
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [workoutHtml, setWorkoutHtml] = useState<string>("")

  // Move the generatePrompt function inside the component
  const generatePrompt = () => {
    if (!questionnaire) return

    let prompt = PROMPT_TEMPLATE

    // Replace all placeholders with actual values
    prompt = prompt.replace(/\[CLIENT NAME\]/g, questionnaire.name || "")
    prompt = prompt.replace(/\[PRIMARY FITNESS GOAL\]/g, questionnaire.goals || "")
    prompt = prompt.replace(/\[SPECIFIC EVENT OR DEADLINE\]/g, questionnaire.specific_event || "")
    prompt = prompt.replace(/\[SECONDARY GOALS\]/g, questionnaire.secondary_goals || "")
    prompt = prompt.replace(/\[CURRENT FITNESS LEVEL\]/g, questionnaire.fitness_level || "")
    prompt = prompt.replace(/\[TRAINING EXPERIENCE\]/g, questionnaire.training_experience || "")
    prompt = prompt.replace(/\[CURRENT STATS OR BENCHMARKS\]/g, questionnaire.stats || "")
    prompt = prompt.replace(/\[CURRENT BODY COMPOSITION OR WEIGHT\]/g, questionnaire.body_composition || "")
    prompt = prompt.replace(/\[PREFERRED TRAINING METHOD OR STYLE\]/g, questionnaire.training_style || "")
    prompt = prompt.replace(/\[TRAINING DAYS PER WEEK\]/g, questionnaire.days_per_week?.toString() || "")
    prompt = prompt.replace(/\[IDEAL WORKOUT DURATION\]/g, questionnaire.workout_duration || "")
    prompt = prompt.replace(/\[SPECIAL SKILLS OR FOCUS EXERCISES\]/g, questionnaire.special_skills || "")
    prompt = prompt.replace(/\[INJURIES OR PHYSICAL LIMITATIONS\]/g, questionnaire.injuries || "")
    prompt = prompt.replace(/\[EXERCISES YOU CANNOT PERFORM\]/g, questionnaire.exercises_to_avoid || "")
    prompt = prompt.replace(/\[EQUIPMENT ACCESS\]/g, questionnaire.equipment || "")
    prompt = prompt.replace(/\[TIME CONSTRAINTS OR SCHEDULING PREFERENCES\]/g, questionnaire.time_constraints || "")
    prompt = prompt.replace(/\[MAIN MOTIVATION\]/g, questionnaire.motivation || "")
    prompt = prompt.replace(/\[CHALLENGES IN STICKING TO A PLAN\]/g, questionnaire.challenges || "")
    prompt = prompt.replace(/\[PREFERRED PROGRESS TRACKING METHOD\]/g, questionnaire.progress_tracking || "")
    prompt = prompt.replace(/\[START DATE\]/g, questionnaire.start_date || "")

    // Calculate end date (31 days after start date)
    if (questionnaire.start_date) {
      const startDate = new Date(questionnaire.start_date)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 30) // 31 days total (start date + 30)
      const endDateString = endDate.toISOString().split("T")[0]
      prompt = prompt.replace(/\[END DATE\]/g, endDateString)
    } else {
      prompt = prompt.replace(/\[END DATE\]/g, "31 days after start")
    }

    setGeneratedPrompt(prompt)
  }

  // Remove the useEffect that calls generatePrompt on component mount
  // as it's better to generate the prompt only when the user clicks the button

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeleteQuestionnaire = async () => {
    if (!questionnaire?.id) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("questionnaire_responses").delete().eq("id", questionnaire.id)

      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error("Error deleting questionnaire:", err)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Fitness Questionnaire</h2>
        <div className="flex space-x-2">
          <button
            onClick={generatePrompt}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Generate Prompt
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-800 mb-2">
            Are you sure you want to delete this questionnaire? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteQuestionnaire}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Basic Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{questionnaire.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Primary Fitness Goal</dt>
                <dd className="mt-1 text-sm text-gray-900">{questionnaire.goals}</dd>
              </div>
              {questionnaire.specific_event && (
                <div>
                  <dt className="text-xs text-gray-500">Specific Event or Deadline</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.specific_event}</dd>
                </div>
              )}
              {questionnaire.secondary_goals && (
                <div>
                  <dt className="text-xs text-gray-500">Secondary Goals</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.secondary_goals}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-500">Fitness Level</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{questionnaire.fitness_level}</dd>
              </div>
              {questionnaire.training_experience && (
                <div>
                  <dt className="text-xs text-gray-500">Training Experience</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.training_experience}</dd>
                </div>
              )}
              {questionnaire.body_composition && (
                <div>
                  <dt className="text-xs text-gray-500">Body Composition/Weight</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.body_composition}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Training Details</h3>
            <dl className="space-y-3">
              {questionnaire.stats && (
                <div>
                  <dt className="text-xs text-gray-500">Current Stats</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.stats}</dd>
                </div>
              )}
              {questionnaire.training_style && (
                <div>
                  <dt className="text-xs text-gray-500">Training Style</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.training_style}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-500">Training Days per Week</dt>
                <dd className="mt-1 text-sm text-gray-900">{questionnaire.days_per_week} days</dd>
              </div>
              {questionnaire.workout_duration && (
                <div>
                  <dt className="text-xs text-gray-500">Workout Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.workout_duration}</dd>
                </div>
              )}
              {questionnaire.special_skills && (
                <div>
                  <dt className="text-xs text-gray-500">Special Skills/Focus</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.special_skills}</dd>
                </div>
              )}
              {questionnaire.equipment && (
                <div>
                  <dt className="text-xs text-gray-500">Equipment Available</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.equipment}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Limitations & Constraints
            </h3>
            <dl className="space-y-3">
              {questionnaire.injuries && (
                <div>
                  <dt className="text-xs text-gray-500">Injuries/Limitations</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.injuries}</dd>
                </div>
              )}
              {questionnaire.exercises_to_avoid && (
                <div>
                  <dt className="text-xs text-gray-500">Exercises to Avoid</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.exercises_to_avoid}</dd>
                </div>
              )}
              {questionnaire.time_constraints && (
                <div>
                  <dt className="text-xs text-gray-500">Time Constraints</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.time_constraints}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Preferences & Scheduling
            </h3>
            <dl className="space-y-3">
              {questionnaire.motivation && (
                <div>
                  <dt className="text-xs text-gray-500">Main Motivation</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.motivation}</dd>
                </div>
              )}
              {questionnaire.challenges && (
                <div>
                  <dt className="text-xs text-gray-500">Challenges</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.challenges}</dd>
                </div>
              )}
              {questionnaire.progress_tracking && (
                <div>
                  <dt className="text-xs text-gray-500">Progress Tracking Method</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.progress_tracking}</dd>
                </div>
              )}
              {questionnaire.start_date && (
                <div>
                  <dt className="text-xs text-gray-500">Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.start_date}</dd>
                </div>
              )}
              {questionnaire.workout_time && (
                <div>
                  <dt className="text-xs text-gray-500">Workout Time</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.workout_time}</dd>
                </div>
              )}
              {questionnaire.timezone && (
                <div>
                  <dt className="text-xs text-gray-500">Timezone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{questionnaire.timezone}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {generatedPrompt && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Generated Prompt</h3>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors flex items-center"
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                    </svg>
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{generatedPrompt}</pre>
            </div>
          </div>
        )}

        {/* Add this new section for workout management */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Workout Management</h3>

          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="current">Current Workout</TabsTrigger>
              <TabsTrigger value="upload">Upload Workout</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <WorkoutDisplay clientId={clientId} workoutHtml={workoutHtml} />
            </TabsContent>

            <TabsContent value="upload">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Paste Workout HTML</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                    placeholder="Paste the workout HTML here..."
                    value={workoutHtml}
                    onChange={(e) => setWorkoutHtml(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">Paste the HTML workout plan generated from the AI.</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Or Upload PDF</h4>
                  <PDFWorkoutUploader onHtmlExtracted={setWorkoutHtml} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
