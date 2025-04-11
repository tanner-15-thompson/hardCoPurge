import { Shield, Award, Clock, HeartHandshake } from "lucide-react"

export function TrustSignals() {
  return (
    <section className="section-style">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Trust HARD Fitness</h2>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="card-style flex flex-col items-center text-center hover:glow transition-all duration-300">
            <div className="bg-purple-950/70 p-4 rounded-full mb-4 backdrop-blur-sm">
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">100% Satisfaction Guarantee</h3>
            <p className="text-gray-300">Not happy with your plan? We'll refund your money within 14 days.</p>
          </div>

          <div className="card-style flex flex-col items-center text-center hover:glow transition-all duration-300">
            <div className="bg-purple-950/70 p-4 rounded-full mb-4 backdrop-blur-sm">
              <Award className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Expert-Crafted Plans</h3>
            <p className="text-gray-300">Created by certified fitness professionals with years of experience.</p>
          </div>

          <div className="card-style flex flex-col items-center text-center hover:glow transition-all duration-300">
            <div className="bg-purple-950/70 p-4 rounded-full mb-4 backdrop-blur-sm">
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Quick Turnaround</h3>
            <p className="text-gray-300">Receive your personalized plan within 24 hours of your consultation.</p>
          </div>

          <div className="card-style flex flex-col items-center text-center hover:glow transition-all duration-300">
            <div className="bg-purple-950/70 p-4 rounded-full mb-4 backdrop-blur-sm">
              <HeartHandshake className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Long-Term Contracts</h3>
            <p className="text-gray-300">Month-to-month service with no hidden fees or commitments.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
