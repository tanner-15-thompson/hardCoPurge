import Image from "next/image"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Michael R.",
    role: "Ironman Competitor",
    image: "/testimonial-1.jpg",
    content:
      "The HARD Workout Plan completely transformed my training. In just 3 months, I shaved 18 minutes off my Ironman time. The personalization is unlike anything I've experienced before.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah T.",
    role: "Weight Loss Journey",
    image: "/testimonial-2.jpg",
    content:
      "After trying countless diets and workout programs, HARD Nutrition Plan was the only one that actually worked for me. Down 32 pounds and feeling stronger than ever!",
    rating: 5,
  },
  {
    id: 3,
    name: "David K.",
    role: "Military Veteran",
    image: "/testimonial-3.jpg",
    content:
      "The attention to detail in my HARD Hybrid Plan is incredible. They considered my old injuries and built a program that pushed me without aggravating them. Game changer.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="section-style">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Clients Say</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real clients have to say about their HARD Fitness experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card-style p-8 flex flex-col relative shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              <div className="absolute -top-4 -left-4">
                <div className="bg-purple-950/70 rounded-full p-3 border border-purple-900/50 backdrop-blur-sm">
                  <Quote className="h-6 w-6 text-purple-400" />
                </div>
              </div>

              <div className="flex items-center mb-6 mt-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-purple-900/50">
                  <Image
                    src={testimonial.image || "/placeholder.svg?height=64&width=64"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-purple-400">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-purple-400 text-purple-400" />
                ))}
              </div>

              <p className="text-gray-300 flex-1 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
