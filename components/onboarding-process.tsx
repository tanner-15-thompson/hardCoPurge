import { CheckCircle2, ArrowRight } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Fill Out Contact Form",
    description:
      "Fill out our contact form so we can give you a call and get all the information we need to perfectly understand your unique situation.",
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: "Expert Consultation",
    description:
      "A fitness expert will reach out personally to gather detailed information about your goals, experience, and limitations to put together your perfect plan.",
    icon: CheckCircle2,
  },
  {
    id: 3,
    title: "Receive Your Plan",
    description:
      "Get your completely personalized plan within 24 hours, with detailed workouts and nutrition guidance tailored specifically to you.",
    icon: CheckCircle2,
  },
  {
    id: 4,
    title: "Follow Your Plan",
    description:
      "Follow your plan for the month, taking notes on your progress, challenges, and results as you go to help us refine future plans.",
    icon: CheckCircle2,
  },
  {
    id: 5,
    title: "Monthly Check-Ins",
    description:
      "We'll conduct monthly check-ins via email or phone to create a new plan built off your previous one, updating with all the latest data we've gathered from what you've accomplished.",
    icon: CheckCircle2,
  },
]

export function OnboardingProcess() {
  return (
    <section className="section-style">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From sign-up to results, here's our proven process for delivering personalized fitness plans that work.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-purple-900/50 transform -translate-x-1/2 hidden md:block"></div>

          {steps.map((step, index) => (
            <div key={step.id} className="relative mb-12 last:mb-0">
              <div
                className={`flex flex-col md:flex-row items-start md:items-center gap-6 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Step number with icon */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-purple-950 border-2 border-purple-900 flex items-center justify-center">
                    <span className="text-xl font-bold">{step.id}</span>
                  </div>
                </div>

                {/* Step content */}
                <div
                  className={`card-style md:w-[calc(50%-3rem)] ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                >
                  <h3 className="text-xl font-bold mb-2 text-purple-400">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>

              {/* Arrow to next step */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4 md:hidden">
                  <ArrowRight className="text-purple-400 h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
