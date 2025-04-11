import Link from "next/link"
import { OptimizedImage } from "@/components/image-optimization"
import { LazySection } from "@/components/lazy-section"
import { Button } from "@/components/ui/button"
import { FAQ } from "@/components/faq"
import { generateMetadata } from "@/app/metadata"
import { DiscountBadge } from "@/components/discount-badge"
import { CostOfInaction } from "@/components/cost-of-inaction"
import { OnboardingProcess } from "@/components/onboarding-process"
import { ProgressTracking } from "@/components/progress-tracking"
import { TrustSignals } from "@/components/trust-signals"
import { ResourcesPreview } from "@/components/resources-preview"
import Script from "next/script"
import Image from "next/image"
import { SuccessRateChart } from "@/components/success-rate-chart"

export const metadata = generateMetadata(
  "HARD Fitness | Hyperpersonalized Plans for Every Level",
  "AI-powered, expert-refined fitness and nutrition plans built for YOU, not the masses.",
)

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Schema.org structured data */}
      <Script
        id="schema-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "HARD Fitness",
            url: "https://hardfitness.com",
            logo: "https://hardfitness.com/logo.png",
            description: "AI-powered, expert-refined fitness and nutrition plans built for YOU, not the masses.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Strength City",
              addressRegion: "SC",
              postalCode: "12345",
              addressCountry: "US",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-555-123-4567",
              contactType: "customer service",
            },
            sameAs: [
              "https://instagram.com/thehardco",
              "https://twitter.com/thehardco",
              "https://facebook.com/hardfitness",
            ],
            offers: [
              {
                "@type": "Offer",
                name: "HARD Workout Plan",
                description: "Personalized workout plans built for your body, goals, and schedule.",
                price: "197",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                name: "HARD Nutrition Plan",
                description: "Customized nutrition guidance tailored to your body and goals.",
                price: "247",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                name: "HARD Hybrid Plan",
                description: "Comprehensive fitness solution combining personalized workout and nutrition plans.",
                price: "397",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//Running%20up%20stairs.jpg"
            alt="Athlete running up stairs in the dark"
            fill={true}
            className="w-full h-full"
            style={{ objectPosition: "center 65%" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-darkgray"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 flex flex-col items-center justify-center">
            <Image
              src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//HARD%20WHITE%20CROPPED.PNG"
              alt="HARD Fitness Logo"
              width={400}
              height={160}
              className="mb-6 w-4/5 max-w-[500px]"
              priority
            />
            <span>Hyperpersonalized Plans for Every Level</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-300">
            AI-powered, expert-refined. Built for YOU, not the masses.
          </p>
          <div className="mb-8 flex justify-center">
            <div className="inline-block bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-900/50 glow">
              <p className="text-xl text-green-400 font-bold">Limited Time: 75% OFF Your First Month</p>
            </div>
          </div>
          <Button
            asChild
            className="bg-purple-950 hover:bg-purple-900 text-white px-8 py-6 text-lg rounded-md pulse-animation"
          >
            <Link href="/contact">Claim Your Plan</Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <LazySection className="w-full bg-gradient-dynamic py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg glow">
              <OptimizedImage
                src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//anastase-maragos-4dlhin0ghOk-unsplash.jpg"
                alt="Athlete with barbell in gym"
                fill={true}
                className="w-full h-full"
              />
            </div>
            <div className="border border-purple-900/30 p-8 rounded-lg bg-black/50 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">My Story</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  My mom was a force. "Thompsons do hard things" wasn't just a saying—it was her life. She faced cancer
                  and every challenge it brought with raw determination, adapting and pushing forward until her last
                  breath. That relentless spirit is the heartbeat of this brand.
                </p>
                <p>
                  When I started chasing my own athletic goals, I hit a wall. The training plans out there were
                  generic—useless for someone like me. They'd throw out "run 10 miles" or "lift for an hour," with no
                  regard for whether I was training for an Ironman, recovering from a 100-mile ultra, or juggling a
                  packed schedule with a hotel gym.
                </p>
                <p>
                  That's why I created HARD—built from scratch for athletes like you. These aren't for the faint of
                  heart; they're for the committed.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="border border-purple-900/30 p-8 rounded-lg bg-black/50 backdrop-blur-sm order-2 md:order-1">
              <div className="text-gray-300 space-y-4">
                <p>
                  This isn't a glossy fitness fad. It's my mom's legacy: face the challenge, adapt, and overcome. These
                  plans are forged for high-level athletes who chase podiums, PRs, and finish lines—not just scale
                  numbers. They're tough, practical, and built to fit your life.
                </p>
                <p>
                  But here's the deal: you don't have to be an elite to start. Whether you're new to working out or
                  already pushing your limits, these plans adapt. Beginners get the structure to build a solid base;
                  high-level athletes get the precision to shatter plateaus. It's hyperpersonalized for you, wherever
                  you're at. If you're ready to ditch the drift and chase real, measurable goals, these plans are your
                  roadmap. Let's get to work.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg glow order-1 md:order-2">
              <OptimizedImage
                src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//anastase-maragos-9dzWZQWZMdE-unsplash.jpg"
                alt="Athlete with weights in gym"
                fill={true}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </LazySection>

      {/* Trust Signals Section */}
      <LazySection>
        <TrustSignals />
      </LazySection>

      {/* Services Overview */}
      <LazySection className="w-full bg-black py-20 px-4 border-t border-purple-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Plans</h2>
          <p className="text-center text-xl text-green-400 font-bold mb-12">First Month 75% OFF for New Clients</p>

          <div className="flex flex-col gap-8 mb-12">
            {/* Workout Plan */}
            <div className="bg-black rounded-lg border border-purple-900/50 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-[200px] md:h-auto">
                  <OptimizedImage
                    src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//roberto-shumski-SHDUbprcCB4-unsplash.jpg"
                    alt="Athlete with barbell"
                    fill={true}
                    className="w-full h-full"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-2xl font-bold mb-2">HARD Workout Plan</h3>
                  <DiscountBadge originalPrice={197} discountPercentage={75} className="mb-4" />
                  <p className="text-gray-300 mb-6">
                    You're tired of screwing around with random workouts that don't deliver. You've wasted hours on
                    apps, videos, or some bro at the gym telling you to "just lift more." Nothing changes—your strength
                    stalls, your energy's flat, and you're pissed off.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full md:w-auto border-purple-900 text-purple-400 hover:bg-purple-950/20"
                  >
                    <Link href="/services">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Nutrition Plan */}
            <div className="bg-black rounded-lg border border-purple-900/50 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-[200px] md:h-auto">
                  <OptimizedImage
                    src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//kyle-johnson-Yi-4X9ZJU6Y-unsplash.jpg"
                    alt="Athlete running in the dark"
                    fill={true}
                    className="w-full h-full"
                    style={{ objectPosition: "center" }}
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-2xl font-bold mb-2">HARD Nutrition Plan</h3>
                  <DiscountBadge originalPrice={247} discountPercentage={75} className="mb-4" />
                  <p className="text-gray-300 mb-6">
                    You've tried eating "right" before—salads that leave you starving, diets that taste like cardboard,
                    or random rules that don't even fit your life. You're still not where you want to be, and it's
                    frustrating as hell.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full md:w-auto border-purple-900 text-purple-400 hover:bg-purple-950/20"
                  >
                    <Link href="/services">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Hybrid Plan */}
            <div className="bg-black rounded-lg border border-purple-900/50 overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 text-sm font-bold z-10">
                BEST VALUE
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-[200px] md:h-auto">
                  <OptimizedImage
                    src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//sven-mieke-optBC2FxCfc-unsplash.jpg"
                    alt="Woman performing squat with barbell"
                    fill={true}
                    className="w-full h-full"
                    style={{ objectPosition: "center" }}
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-2xl font-bold mb-2">HARD Hybrid Plan</h3>
                  <DiscountBadge originalPrice={397} discountPercentage={75} className="mb-4" />
                  <p className="text-gray-300 mb-6">
                    You're done with piecemeal fixes—workouts that don't match your diet, diets that don't match your
                    day. You want results, not experiments. The HARD Hybrid Plan is the real deal.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full md:w-auto border-purple-900 text-purple-400 hover:bg-purple-950/20"
                  >
                    <Link href="/services">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-32 h-1 bg-purple-900/30"></div>
          </div>
        </div>
      </LazySection>

      {/* Cost of Inaction Section - MOVED HERE */}
      <LazySection className="w-full bg-black py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">The Cost of Doing Nothing</h2>
          <p className="text-xl text-gray-300 mb-12 text-center">
            Compare the average cost of a nutritionist ($220/month) and personal trainer ($580/month) versus a
            personalized HARD Hybrid plan.
          </p>
          <CostOfInaction />
        </div>
      </LazySection>

      {/* Onboarding Process Section */}
      <LazySection>
        <OnboardingProcess />
      </LazySection>

      {/* Success Rate Chart Section - NEW */}
      <LazySection>
        <SuccessRateChart />
      </LazySection>

      {/* Progress Tracking Section */}
      <LazySection>
        <ProgressTracking />
      </LazySection>

      {/* Resources Preview Section */}
      <LazySection>
        <ResourcesPreview />
      </LazySection>

      {/* FAQ Section */}
      <LazySection className="w-full bg-black py-20 px-4 border-t border-purple-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <FAQ />
        </div>
      </LazySection>

      {/* Combined CTA Section */}
      <LazySection className="w-full bg-black py-20 px-4 border-t border-purple-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black border border-purple-900/50 rounded-lg p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
              <div className="inline-block bg-green-900/30 px-6 py-3 rounded-lg border border-green-600/50 mb-4">
                <p className="text-xl text-green-400 font-bold">Limited Time: 75% OFF Your First Month</p>
              </div>
              <p className="text-lg text-gray-300">
                Start your fitness journey today with our expert-crafted, personalized plans.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <Button
                asChild
                className="bg-purple-950 hover:bg-purple-900 text-white px-8 py-6 text-lg rounded-md w-full md:w-auto"
              >
                <Link href="/contact">Claim Your Plan</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-purple-900 text-purple-400 hover:bg-purple-950/20 px-8 py-6 text-lg rounded-md w-full md:w-auto"
              >
                <Link href="/examples">View Sample Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Footer Links to Legal Pages */}
      <div className="w-full bg-black py-4 px-4 border-t border-purple-900/30 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <Link href="/privacy-policy" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
