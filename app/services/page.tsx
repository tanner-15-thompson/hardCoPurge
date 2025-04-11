import Link from "next/link"
import { OptimizedImage } from "@/components/image-optimization"
import { LazySection } from "@/components/lazy-section"
import { Button } from "@/components/ui/button"
import { CTASection } from "@/components/cta-section"
import { FAQ } from "@/components/faq"
import { generateMetadata } from "@/app/metadata"
import { DiscountBadge } from "@/components/discount-badge"

export const metadata = generateMetadata(
  "Our Services | HARD Fitness",
  "Explore our hyperpersonalized workout and nutrition plans designed for your specific goals and lifestyle.",
)

export default function Services() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="section-style">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Plans Built for Your Grind</h1>
          <p className="text-xl text-gray-300">
            Hyperpersonalized plans designed for your specific goals and lifestyle.
          </p>
          <div className="mt-6 inline-block bg-green-900/20 px-6 py-3 rounded-lg border border-green-600/30 glow">
            <p className="text-xl text-green-400 font-bold">Limited Time: 75% OFF Your First Month</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Workout Plan */}
          <div className="card-style overflow-hidden transition-all duration-300 hover:glow">
            <div className="relative h-64 w-full">
              <OptimizedImage
                src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//roberto-shumski-SHDUbprcCB4-unsplash.jpg"
                alt="Athlete with barbell"
                fill={true}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-3xl font-bold mb-2">HARD Workout Plan</h2>
                <DiscountBadge originalPrice={197} discountPercentage={75} />
              </div>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-lg">
                You're tired of screwing around with random workouts that don't deliver. You've wasted hours on apps,
                videos, or some bro at the gym telling you to "just lift more." Nothing changes—your strength stalls,
                your energy's flat, and you're pissed off. The HARD Workout Plan isn't that. It's 31 days built for
                you—your body, your goals, your time. We take where you're at right now and give you a plan that's
                yours, not some cookie-cutter crap. It evolves as you do, so you're not stuck doing the same old shit
                while the world moves on.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">What You Get:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Day 1: You start with moves that match your level—no overcomplicated nonsense.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Week 2: You're already stronger, and the plan adjusts to keep you moving.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Month 3: People notice. You're not just "trying"—you're doing.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold">Why It Works:</p>
                <p className="text-gray-300">
                  You're not guessing what's next. Every rep, every set, every day—it's laid out, clear as hell.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold">Cost:</p>
                <p className="text-gray-300">
                  <span className="line-through">$197/month</span>{" "}
                  <span className="text-green-400 font-bold">First month: $49</span> (75% off). That's $1.63/day. You
                  drop more on a coffee you forget by tomorrow. This sticks with you.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold">The Catch:</p>
                <p className="text-gray-300">
                  It's not magic. You've got to show up and do the work. If you're not ready for that, save your money.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  asChild
                  className="w-full bg-purple-950 hover:bg-purple-900 text-white py-6 text-lg rounded-md pulse-animation"
                >
                  <Link href="/contact">Claim Your Plan</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Simple divider */}
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-purple-900/30"></div>
          </div>

          {/* Nutrition Plan */}
          <LazySection className="card-style overflow-hidden transition-all duration-300 hover:glow">
            <div className="relative h-64 w-full">
              <OptimizedImage
                src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//kyle-johnson-Yi-4X9ZJU6Y-unsplash.jpg"
                alt="Athlete running in the dark"
                fill={true}
                className="w-full h-full"
                style={{ objectPosition: "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-3xl font-bold mb-2">HARD Nutrition Plan</h2>
                <DiscountBadge originalPrice={247} discountPercentage={75} />
              </div>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-lg">
                You've tried eating "right" before—salads that leave you starving, diets that taste like cardboard, or
                random rules that don't even fit your life. You're still not where you want to be, and it's frustrating
                as hell. The HARD Nutrition Plan cuts through that. It's 31 days of meals made for you—your workouts,
                your body, your goals. No starvation, no guesswork, just food that fuels you and doesn't suck to eat.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">What You Get:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Day 1: You eat, you feel good, you're not crawling to the fridge at midnight.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Week 2: Energy's up, pants fit better, and it's still your food.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Month 3: You're leaner, stronger, and it's not a fluke—it's a system.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold">Why It Works:</p>
                <p className="text-gray-300">
                  It's not generic "eat less" bullshit. It's your macros, your portions, your life.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold">Cost:</p>
                <p className="text-gray-300">
                  <span className="line-through">$247/month</span>{" "}
                  <span className="text-green-400 font-bold">First month: $62</span> (75% off). That's $2.07/day. You've
                  blown more on a burrito that didn't even fill you up.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold">The Catch:</p>
                <p className="text-gray-300">
                  If you're not ready to ditch the excuses about "healthy eating," this isn't for you.
                </p>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full bg-purple-950 hover:bg-purple-900 text-white py-6 text-lg rounded-md">
                  <Link href="/contact">Claim Your Plan</Link>
                </Button>
              </div>
            </div>
          </LazySection>

          {/* Simple divider */}
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-purple-900/30"></div>
          </div>

          {/* Hybrid Plan */}
          <LazySection className="card-style overflow-hidden transition-all duration-300 hover:glow relative">
            <div className="absolute top-0 right-0 bg-green-800 text-white px-4 py-1 text-sm font-bold z-10">
              BEST VALUE
            </div>

            <div className="relative h-64 w-full">
              <OptimizedImage
                src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//sven-mieke-optBC2FxCfc-unsplash.jpg"
                alt="Woman performing squat with barbell"
                fill={true}
                className="w-full h-full"
                style={{ objectPosition: "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-3xl font-bold mb-2">HARD Hybrid Plan</h2>
                <DiscountBadge originalPrice={397} discountPercentage={75} />
              </div>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-lg">
                You're done with piecemeal fixes—workouts that don't match your diet, diets that don't match your day.
                You want results, not experiments. The HARD Hybrid Plan is the real deal: 31 days where your training
                and eating sync up perfectly, built for you. Your workouts push you; your meals back it up. No gaps, no
                wasted effort—just progress.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">What You Get:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Day 1: It all clicks—food and lifts working together.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Week 2: You're stronger, sharper, and it's not random luck.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Month 3: You're a different person—fitter, tougher, done messing around.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold">Why It Works:</p>
                <p className="text-gray-300">
                  It's one plan, not two guesses. Everything's tailored, everything's connected.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold">Cost:</p>
                <p className="text-gray-300">
                  <span className="line-through">$397/month</span>{" "}
                  <span className="text-green-400 font-bold">First month: $99</span> (75% off). That's $3.30/day. You've
                  spent more on a night out that left you with nothing but a headache.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold">The Catch:</p>
                <p className="text-gray-300">This is all-in. If you're still half-assing it, don't bother.</p>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full bg-purple-950 hover:bg-purple-900 text-white py-6 text-lg rounded-md">
                  <Link href="/contact">Claim Your Plan</Link>
                </Button>
              </div>
            </div>
          </LazySection>
        </div>
      </section>

      {/* FAQ Section */}
      <LazySection>
        <FAQ />
      </LazySection>

      {/* CTA Section */}
      <LazySection>
        <CTASection />
      </LazySection>
    </main>
  )
}
