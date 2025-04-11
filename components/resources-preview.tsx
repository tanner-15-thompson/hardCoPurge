import Link from "next/link"
import { ArrowRight, FileText, Video, FileBarChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ResourcesPreview() {
  return (
    <section className="section-style">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Free Fitness Resources</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access our expert guides and tools to jumpstart your fitness journey, even before you sign up.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="card-style hover:border-purple-400 transition-colors hover:glow">
            <div className="bg-purple-950/30 p-3 rounded-lg inline-block mb-4">
              <FileText className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Beginner's Guide to Fitness</h3>
            <p className="text-gray-300 mb-4">
              Learn the fundamentals of effective training and nutrition without the fluff.
            </p>
            <Link href="#" className="text-purple-400 inline-flex items-center hover:underline">
              Download PDF <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="card-style hover:border-purple-400 transition-colors hover:glow">
            <div className="bg-purple-950/30 p-3 rounded-lg inline-block mb-4">
              <Video className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Form Check: 5 Key Exercises</h3>
            <p className="text-gray-300 mb-4">
              Watch our detailed breakdown of proper form for the most important movements.
            </p>
            <Link href="#" className="text-purple-400 inline-flex items-center hover:underline">
              Watch Videos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="card-style hover:border-purple-400 transition-colors hover:glow">
            <div className="bg-purple-950/30 p-3 rounded-lg inline-block mb-4">
              <FileBarChart className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Progress Tracking Template</h3>
            <p className="text-gray-300 mb-4">
              A simple but effective spreadsheet to track your workouts and nutrition.
            </p>
            <Link href="#" className="text-purple-400 inline-flex items-center hover:underline">
              Download Template <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Button asChild className="bg-purple-950 hover:bg-purple-900 text-white px-6 glow">
            <Link href="/contact">Get Your Personalized Plan</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
