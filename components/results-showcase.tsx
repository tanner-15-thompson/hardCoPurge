import { OptimizedImage } from "@/components/image-optimization"
import { ArrowRight } from "lucide-react"

interface ResultsData {
  id: number
  name: string
  timeframe: string
  achievement: string
  stats: {
    label: string
    before: string
    after: string
  }[]
  image: string
}

const resultsData: ResultsData[] = [
  {
    id: 1,
    name: "Michael R.",
    timeframe: "3 Months",
    achievement: "Ironman PR",
    stats: [
      { label: "Ironman Time", before: "11:42:15", after: "11:24:03" },
      { label: "Run Split", before: "4:12:30", after: "3:58:45" },
      { label: "Weekly Training", before: "8 hours", after: "10 hours" },
    ],
    image: "/fitness-runner.jpg",
  },
  {
    id: 2,
    name: "Sarah T.",
    timeframe: "4 Months",
    achievement: "Weight Loss",
    stats: [
      { label: "Weight", before: "182 lbs", after: "150 lbs" },
      { label: "Body Fat %", before: "32%", after: "24%" },
      { label: "Squat 1RM", before: "95 lbs", after: "165 lbs" },
    ],
    image: "/fitness-squat-woman.jpg",
  },
  {
    id: 3,
    name: "David K.",
    timeframe: "6 Months",
    achievement: "Strength Gains",
    stats: [
      { label: "Bench Press", before: "185 lbs", after: "265 lbs" },
      { label: "Deadlift", before: "275 lbs", after: "405 lbs" },
      { label: "Pull-ups", before: "3 reps", after: "12 reps" },
    ],
    image: "/fitness-barbell.jpg",
  },
]

export function ResultsShowcase() {
  return (
    <section className="section-style">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Real Results</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our clients don't just get plans—they get results. Here's the proof.
          </p>
        </div>

        <div className="space-y-12">
          {resultsData.map((result) => (
            <div
              key={result.id}
              className="card-style overflow-hidden shadow-lg hover:glow transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-[300px] md:h-auto">
                  <OptimizedImage
                    src={result.image}
                    alt={`${result.name}'s transformation`}
                    fill={true}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="bg-black/50 p-4 rounded-lg border border-purple-900/30 backdrop-blur-sm">
                      <h3 className="text-2xl font-bold">{result.name}</h3>
                      <p className="text-purple-400 font-bold">
                        {result.achievement} in {result.timeframe}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3 p-8">
                  <h4 className="text-xl font-bold mb-6 text-purple-400">Transformation Metrics</h4>

                  <div className="space-y-6">
                    {result.stats.map((stat, index) => (
                      <div key={index} className="relative">
                        <div className="mb-2 font-bold text-lg">{stat.label}</div>
                        <div className="flex items-center">
                          <div className="w-1/3 bg-red-950/20 p-3 rounded-l-lg border border-red-900/30 backdrop-blur-sm">
                            <div className="text-red-400 font-mono font-bold">{stat.before}</div>
                            <div className="text-xs text-gray-400">BEFORE</div>
                          </div>

                          <div className="w-8 flex justify-center">
                            <ArrowRight className="text-purple-400" />
                          </div>

                          <div className="w-1/3 bg-green-950/20 p-3 rounded-r-lg border border-green-600/30 backdrop-blur-sm">
                            <div className="text-green-400 font-mono font-bold">{stat.after}</div>
                            <div className="text-xs text-gray-400">AFTER</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
