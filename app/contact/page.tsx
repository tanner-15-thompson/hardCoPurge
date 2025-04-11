import { OptimizedImage } from "@/components/image-optimization"
import { EnhancedContactForm } from "@/components/enhanced-contact-form"

export default function Contact() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="section-style">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden glow">
              <OptimizedImage
                src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//brendan-stephens-0eFueVGCSqg-unsplash.jpg"
                alt="Athlete lifting weight overhead"
                fill={true}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Started</h1>
                <p className="text-xl text-gray-300">Claim your 7-day free trial and start your HARD journey today.</p>
              </div>
            </div>

            <div className="card-style p-8">
              <EnhancedContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
