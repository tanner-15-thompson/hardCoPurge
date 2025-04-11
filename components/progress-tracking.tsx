import { LineChart, BarChart, PieChart, Activity } from "lucide-react"

export function ProgressTracking() {
  return (
    <section className="section-style">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Track Your Progress</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your HARD Fitness plan includes powerful tools to monitor your progress and keep you accountable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-style">
            <div className="flex items-start mb-6">
              <div className="bg-purple-950 p-3 rounded-lg mr-4">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Performance Metrics</h3>
                <p className="text-gray-300">
                  Track key performance indicators like strength gains, endurance improvements, body composition
                  changes, and more. Our system automatically calculates your progress over time.
                </p>
              </div>
            </div>

            <div className="bg-black/50 border border-purple-900/30 rounded-lg p-4 mb-6 backdrop-blur-sm">
              <h4 className="font-medium mb-2">What You'll Track:</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">→</span>
                  <span>Strength metrics (1RM, volume, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">→</span>
                  <span>Body measurements and composition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">→</span>
                  <span>Workout completion and consistency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">→</span>
                  <span>Energy levels and recovery quality</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <LineChart className="h-32 w-32 text-purple-400 opacity-50" />
            </div>
          </div>

          <div className="card-style">
            <div className="flex items-start mb-6">
              <div className="bg-purple-950 p-3 rounded-lg mr-4">
                <BarChart className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Adaptive Programming</h3>
                <p className="text-gray-300">
                  Your plan evolves based on your progress data. Our system analyzes your results and adjusts your
                  program to ensure continued progress and prevent plateaus.
                </p>
              </div>
            </div>

            <div className="bg-black/50 border border-purple-900/30 rounded-lg p-4 mb-6 backdrop-blur-sm">
              <h4 className="font-medium mb-2">How Your Plan Adapts:</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">→</span>
                  <span>Auto-adjusting intensity based on performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">→</span>
                  <span>Progressive overload calculations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">→</span>
                  <span>Nutrition adjustments based on body response</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">→</span>
                  <span>Monthly program reviews and updates</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <PieChart className="h-32 w-32 text-purple-400 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
