import Link from "next/link"
import { default as Image } from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const OptimizedImage = Image

export default function ExamplesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-black">
      <section className="relative w-full h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//HARDWHITE2.PNG"
            alt="HARD Fitness Logo"
            fill={true}
            className="object-contain bg-black"
            style={{ objectPosition: "center 40%" }}
            priority
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Sample Plans</h1>
          <p className="text-xl md:text-2xl text-gray-300">Real plans. Real results. No bullshit.</p>
        </div>
      </section>

      <section className="w-full py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What You Actually Get</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              These are real plans created for real clients. Names changed, results not. This is what
              hyperpersonalization looks like—plans built for your body, your goals, your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-black border border-purple-900/50 rounded-lg overflow-hidden">
              <div className="relative h-64 w-full">
                <OptimizedImage
                  src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//zack-marshall-EVV3139tNZk-unsplash.jpg"
                  alt="Military fitness training"
                  fill={true}
                  className="w-full h-full"
                  style={{ objectPosition: "center 65%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold mb-2">Tanner T.</h3>
                  <p className="text-purple-400 font-bold">Special Forces Selection Prep</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  31-day plan for a client preparing for Special Forces Assessment and Selection (SFAS).
                  Hyperpersonalized training focusing on strength, endurance, and rucking with progressive overload.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>5-week progressive training cycle</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Targeted strength and endurance goals</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Nutrition plan synced with training demands</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black border border-purple-900/50 rounded-lg overflow-hidden">
              <div className="relative h-64 w-full">
                <OptimizedImage
                  src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//scott-webb-W-3Wvff8qsQ-unsplash%20(1).jpg"
                  alt="Bodybuilding training"
                  fill={true}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold mb-2">Sydney P.</h3>
                  <p className="text-purple-400 font-bold">Bikini Competition Prep</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  31-day plan for a client preparing for a bikini bodybuilding competition. Hyperpersonalized training
                  focusing on muscle development, definition, and aesthetic proportions.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>7-day training split targeting all muscle groups</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Progressive overload for strength gains</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Nutrition plan for muscle growth and definition</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black border border-purple-900/50 rounded-lg overflow-hidden">
              <div className="relative h-64 w-full">
                <OptimizedImage
                  src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//john-fornander-TAZoUmDqzXk-unsplash.jpg"
                  alt="Athlete with water bottle"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 10%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold mb-2">Noah H.</h3>
                  <p className="text-purple-400 font-bold">Weight Loss & Hyrox Training</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  31-day plan for a client looking to lose 15 lbs by July. Hyperpersonalized training focusing on
                  Hyrox-style workouts with dumbbell exercises and running form improvement.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>5-day training split with progressive overload</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Hyrox-specific circuit training</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Lower back pain reduction focus</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black border border-purple-900/50 rounded-lg overflow-hidden">
              <div className="relative h-64 w-full">
                <OptimizedImage
                  src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//alora-griffiths-JNeYWQncbj8-unsplash.jpg"
                  alt="Athlete lifting weight overhead"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold mb-2">Kaden P.</h3>
                  <p className="text-purple-400 font-bold">Body Recomposition</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  31-day plan for a client focused on cutting body fat while increasing muscle mass. Hyperpersonalized
                  training with a 5-day split targeting specific muscle groups with progressive overload.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Balanced strength and HIIT training</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Strategic cardio for fat loss</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Rotator cuff focus for shoulder health</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border border-purple-900/50 rounded-lg overflow-hidden mb-16">
            <Tabs defaultValue="tanner-workout" className="w-full">
              <div className="p-6 border-b border-purple-900/30">
                <h3 className="text-2xl font-bold mb-4">Tanner's Plan</h3>
                <TabsList className="grid grid-cols-2 bg-black border border-purple-900/50">
                  <TabsTrigger value="tanner-workout" className="data-[state=active]:bg-purple-950">
                    Workout Plan
                  </TabsTrigger>
                  <TabsTrigger value="tanner-nutrition" className="data-[state=active]:bg-purple-950">
                    Nutrition Plan
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="tanner-workout" className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Plan Overview</h4>
                    <p className="text-gray-300 mb-4">
                      Client: Tanner T.
                      <br />
                      Start Date: March 17
                      <br />
                      End Date (Phase 1): April 16
                      <br />
                      Goal: Get selected at SFAS
                      <br />
                      Training Days: Monday–Friday (5 days/week)
                      <br />
                      Focus: Tactical/functional training, emphasizing rucking
                      <br />
                      Timeline: ~6 months (27 weeks) total; this is Phase 1 (5 weeks)
                    </p>
                    <p className="text-gray-300">
                      <span className="font-bold">Phase 1 Targets:</span>
                      <br />
                      Squat: Increase by 10 lbs (to 310 lbs)
                      <br />
                      2-Mile Run: Improve by 15 seconds (to 14:30)
                      <br />
                      Ruck Pace: Maintain 15 min/mile for up to 7 miles
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Week 1 Sample (March 17–23)</h4>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Day 1: Monday, March 17 - Strength (Lower Body)</h5>
                      <p className="text-sm text-gray-400 mb-2">
                        Warm-up (5 min): Jog 400m, 10 leg swings/leg, 10 hip circles/direction, 10 bodyweight squats
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Main (30 min):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Squats: 4 sets of 8 @ 210 lbs</li>
                        <li>Deadlifts: 3 sets of 5 @ 225 lbs</li>
                        <li>Lunges: 3 sets of 10/leg @ 30 lbs dumbbells</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Auxiliary (20 min):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Farmer's Carry: 3x100m @ 50 lbs/hand</li>
                        <li>Plank: 3x60s</li>
                      </ul>
                      <p className="text-sm text-gray-400">
                        Cool-down (5 min): Hamstring stretch (30s/leg), quad stretch (30s/leg), calf stretch (30s/leg)
                      </p>
                    </div>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Day 3: Wednesday, March 19 - Rucking</h5>
                      <p className="text-sm text-gray-400 mb-2">
                        Warm-up (5 min): 10 leg swings/leg, 10 hip openers, light jog 400m
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Main (60 min):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>4-mile ruck @ 45 lbs, 15 min/mile</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Auxiliary (20 min):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>3x10 push-ups</li>
                        <li>3x8 pull-ups</li>
                        <li>3x12 dumbbell rows @ 30 lbs/arm</li>
                      </ul>
                      <p className="text-sm text-gray-400">
                        Cool-down (5 min): Shoulder stretch (30s/arm), child's pose (60s)
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Progression Notes</h4>
                    <ul className="list-disc pl-6 text-gray-300">
                      <li>Strength: Add 5 lbs to main lifts weekly (e.g., squats: 210 → 215 → 220 → 225 lbs)</li>
                      <li>Long Run: Increase by 0.5 miles weekly (5 → 5.5 → 6 → 6.5 miles)</li>
                      <li>Rucking: Increase by 1 mile weekly (4 → 5 → 6 → 7 miles), keep 15 min/mile</li>
                      <li>
                        Intervals: Vary distance/intensity weekly (400m → 800m → 200m → 1 mile) for speed and VO2 max
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tanner-nutrition" className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Nutrition Overview</h4>
                    <p className="text-gray-300 mb-4">
                      Client: Tanner T.
                      <br />
                      Timeline: March 17 – April 16 (31 days, Phase 1)
                      <br />
                      Goals: Maintain weight at 172 lbs, support strength gains, improve endurance
                      <br />
                      Daily Caloric Target: 3000 kcal/day
                      <br />
                      Macros: 180–190g protein, 350–370g carbs, 80–90g fat
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Sample Recipes</h4>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Core Breakfast: Protein-Packed Overnight Oats</h5>
                      <p className="text-sm text-gray-400 mb-2">5 min prep, 0 min cook</p>
                      <p className="mb-2">
                        <span className="font-bold">Ingredients:</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>½ cup rolled oats</li>
                        <li>1 scoop whey protein powder</li>
                        <li>1 tbsp almond butter</li>
                        <li>½ cup almond milk</li>
                        <li>1 banana (sliced)</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Steps:</span>
                      </p>
                      <ol className="list-decimal pl-6 mb-2 text-gray-300">
                        <li>In a mason jar or bowl, add ½ cup rolled oats and 1 scoop whey protein powder.</li>
                        <li>Spoon in 1 tbsp almond butter and pour in ½ cup almond milk.</li>
                        <li>
                          Stir thoroughly until smooth, cover with a lid or plastic wrap, and refrigerate overnight.
                        </li>
                        <li>Before your 7 AM workout, slice 1 banana, stir it in, and eat cold.</li>
                      </ol>
                      <p className="text-sm text-gray-400">Macros: 500 kcal, 35g protein, 55g carbs, 15g fat</p>
                    </div>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Boost Meal: Turkey Tacos with Black Beans</h5>
                      <p className="text-sm text-gray-400 mb-2">25 min total</p>
                      <p className="mb-2">
                        <span className="font-bold">Ingredients:</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>6 oz ground turkey</li>
                        <li>1 tsp taco seasoning</li>
                        <li>2 whole wheat tortillas</li>
                        <li>½ cup black beans (drained)</li>
                        <li>1 avocado (sliced)</li>
                        <li>1 tbsp lime juice</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Steps:</span>
                      </p>
                      <ol className="list-decimal pl-6 mb-2 text-gray-300">
                        <li>
                          Heat a skillet to medium, add 6 oz ground turkey and 1 tsp taco seasoning, breaking it up with
                          a spatula.
                        </li>
                        <li>Cook 5-7 min until browned and fully cooked (165°F internal temp).</li>
                        <li>Microwave 2 tortillas for 10 sec to soften.</li>
                        <li>Fill each tortilla with half the turkey, ¼ cup black beans, and half a sliced avocado.</li>
                        <li>Squeeze 1 tbsp lime juice over both tacos and enjoy.</li>
                      </ol>
                      <p className="text-sm text-gray-400">Macros: 700 kcal, 40g protein, 60g carbs, 25g fat</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-black border border-purple-900/50 rounded-lg overflow-hidden mb-16">
            <Tabs defaultValue="sydney-workout" className="w-full">
              <div className="p-6 border-b border-purple-900/30">
                <h3 className="text-2xl font-bold mb-4">Sydney's Plan</h3>
                <TabsList className="grid grid-cols-2 bg-black border border-purple-900/50">
                  <TabsTrigger value="sydney-workout" className="data-[state=active]:bg-purple-950">
                    Workout Plan
                  </TabsTrigger>
                  <TabsTrigger value="sydney-nutrition" className="data-[state=active]:bg-purple-950">
                    Nutrition Plan
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="sydney-workout" className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Plan Overview</h4>
                    <p className="text-gray-300 mb-4">
                      Client: Sydney P.
                      <br />
                      Start Date: March 24, 2025
                      <br />
                      End Date (Phase 1): April 23, 2025
                      <br />
                      Goal: Win a bikini bodybuilding competition in July
                      <br />
                      Training Days: 7 per week
                      <br />
                      Focus: Bodybuilding, working different muscle groups each day
                      <br />
                      Timeline: Approximately 16 weeks to July; multi-phase program
                    </p>
                    <p className="text-gray-300">
                      <span className="font-bold">Phase 1 Targets:</span>
                      <br />
                      Increase squat to 145 lbs, bench to 105 lbs, enhance glute size and definition
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Week 1 Sample (March 24–30)</h4>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Day 1: Monday, March 24 - Glutes</h5>
                      <p className="text-sm text-gray-400 mb-2">
                        Warm-up: 5 min of leg swings, bodyweight squats, and glute bridges
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Main:</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Barbell Hip Thrusts: 4x10-12 (135 lbs or challenging weight)</li>
                        <li>Dumbbell Sumo Squats: 4x12 (40 lb dumbbell)</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Auxiliary:</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Cable Kickbacks: 3x15 per leg (moderate weight)</li>
                        <li>Abductor Machine: 3x15 (moderate weight)</li>
                      </ul>
                      <p className="text-sm text-gray-400">Cool-down: 5 min of stretching glutes and hip flexors</p>
                      <p className="text-sm text-gray-400">
                        Progression: Increase hip thrust weight by 5 lbs if all reps are completed with good form
                      </p>
                      <p className="text-sm italic text-purple-400">
                        Motivational tip: Visualize your glutes growing with each thrust!
                      </p>
                    </div>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Day 4: Thursday, March 27 - Back</h5>
                      <p className="text-sm text-gray-400 mb-2">
                        Warm-up: 5 min of arm circles, band pull-aparts, and light lat pulldowns
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Main:</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Pull-ups: 4x8-12 (bodyweight or assisted if needed)</li>
                        <li>Bent-Over Barbell Rows: 3x8-10 (70 lbs or challenging weight)</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Auxiliary:</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Seated Cable Rows: 3x12 (moderate weight)</li>
                        <li>Dumbbell Rows: 3x12 per arm (25 lb dumbbell)</li>
                      </ul>
                      <p className="text-sm text-gray-400">Cool-down: 5 min of stretching back, lats, and shoulders</p>
                      <p className="text-sm text-gray-400">
                        Progression: Add weight to pull-ups or rows if 12 reps are easy
                      </p>
                      <p className="text-sm italic text-purple-400">
                        Motivational tip: A strong back is the foundation of a great physique—pull hard!
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Progression Notes</h4>
                    <p className="text-gray-300 mb-2">
                      Weekly progression is built into each exercise, with specific weight increases based on
                      performance:
                    </p>
                    <ul className="list-disc pl-6 text-gray-300">
                      <li>Barbell Hip Thrusts: +5 lbs weekly (135 → 140 → 145 → 150 → 155 lbs)</li>
                      <li>Barbell Squats: +5 lbs weekly (135 → 140 → 145 → 150 lbs)</li>
                      <li>Bench Press: +5 lbs weekly (95 → 100 → 105 lbs)</li>
                      <li>All accessory movements increase progressively based on performance</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sydney-nutrition" className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Nutrition Overview</h4>
                    <p className="text-gray-300 mb-4">
                      Client: Sydney P.
                      <br />
                      Timeline: March 24, 2025 – April 23, 2025 (31 days, Phase 1)
                      <br />
                      Goals: Support muscle gain (target: gain 0.25 lbs/week), fuel intense workouts
                      <br />
                      Daily Macros: 2385 kcal, 150g protein, 300g carbs, 65g fat
                      <br />
                      Consistent macros across 7 training days/week
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Sample Recipes</h4>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Core Breakfast: Overnight Protein Oats</h5>
                      <p className="text-sm text-gray-400 mb-2">10 min prep (night before) + 2 min (morning)</p>
                      <p className="mb-2">
                        <span className="font-bold">Ingredients (1 serving):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>1/2 cup rolled oats</li>
                        <li>1 scoop whey protein (vanilla or chocolate)</li>
                        <li>1/2 cup Greek yogurt</li>
                        <li>1/2 cup almond milk</li>
                        <li>1 tbsp chia seeds</li>
                        <li>1/2 banana, sliced</li>
                        <li>1 tbsp honey</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Instructions:</span>
                      </p>
                      <ol className="list-decimal pl-6 mb-2 text-gray-300">
                        <li>In a mason jar, add oats, whey protein, Greek yogurt, almond milk, and chia seeds.</li>
                        <li>Stir with a spoon for 1 minute until fully combined.</li>
                        <li>Seal jar and refrigerate overnight (at least 6 hours).</li>
                        <li>Next morning, remove from fridge, slice 1/2 banana, and layer on top.</li>
                        <li>Drizzle 1 tbsp honey over banana.</li>
                        <li>Eat cold or microwave for 1 min if warm preferred.</li>
                      </ol>
                      <p className="text-sm text-gray-400">Macros: ~450 kcal, 40g protein, 50g carbs, 10g fat</p>
                      <p className="text-sm text-gray-400">
                        Purpose: High protein and carbs for post-workout recovery after 5:30 AM sessions.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-black border border-purple-900/50 rounded-lg overflow-hidden mb-16">
            <Tabs defaultValue="noah-workout" className="w-full">
              <div className="p-6 border-b border-purple-900/30">
                <h3 className="text-2xl font-bold mb-4">Noah's Plan</h3>
                <TabsList className="grid grid-cols-1 bg-black border border-purple-900/50">
                  <TabsTrigger value="noah-workout" className="data-[state=active]:bg-purple-950">
                    Workout Plan
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="noah-workout" className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Plan Overview</h4>
                    <p className="text-gray-300 mb-4">
                      Client: Noah H.
                      <br />
                      Start Date: March 24, 2025
                      <br />
                      End Date (Phase 1): April 23, 2025
                      <br />
                      Goal: Lose 15 lbs by July
                      <br />
                      Training Days: 5 per week
                      <br />
                      Focus: Hyrox with lots of dumbbell work
                      <br />
                      Timeline: 4 months to July; multi phases
                    </p>
                    <p className="text-gray-300">
                      <span className="font-bold">Phase 1 Targets:</span>
                      <br />
                      Lose 4-5 lbs, improve running form to reduce lower back pain, maintain strength
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Week 1 Sample</h4>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Day 1: Monday, March 24 - Strength (Lower Body)</h5>
                      <p className="text-sm text-gray-400 mb-2">
                        Warm-up (5 min): Leg swings, hip circles, light jogging
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Main (30 min):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Barbell back squat: 4 sets of 8 reps at 250 lbs</li>
                        <li>Dumbbell walking lunges: 3 sets of 10 reps per leg with 40 lb dumbbells</li>
                        <li>Dumbbell Romanian deadlifts: 3 sets of 10 reps with 50 lb dumbbells</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Auxiliary (20 min):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Calf raises: 3 sets of 15 reps with 60 lb dumbbell</li>
                        <li>Bird dogs: 3 sets of 10 per side</li>
                        <li>Glute bridges: 3 sets of 15 reps</li>
                      </ul>
                      <p className="text-sm text-gray-400">
                        Cool-down (5 min): Hamstring stretch, quad stretch, lower back stretch
                      </p>
                    </div>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Day 4: Thursday, March 27 - Hyrox-Style Circuit</h5>
                      <p className="text-sm text-gray-400 mb-2">
                        Warm-up (5 min): Jumping jacks, bodyweight squats, lunges
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Main (40 min):</span>
                      </p>
                      <p className="mb-2">Circuit (4 rounds):</p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Dumbbell thrusters (30 lb dumbbells): 1 min</li>
                        <li>Burpees: 1 min</li>
                        <li>Dumbbell renegade rows (30 lb dumbbells): 1 min</li>
                        <li>Box jumps (24-inch box): 1 min</li>
                        <li>Rest: 2 min between rounds</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Auxiliary (10 min):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Farmer's carry with 50 lb dumbbells: 3 sets of 1 min</li>
                      </ul>
                      <p className="text-sm text-gray-400">Cool-down (5 min): Full body stretch</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Progression Notes</h4>
                    <ul className="list-disc pl-6 text-gray-300">
                      <li>Increase weights by 5-10 lbs or add reps/sets each week for strength exercises</li>
                      <li>Increase running distance by 0.5 miles or add intervals each week for cardio</li>
                      <li>Add rounds or reduce rest time for Hyrox-style circuits</li>
                      <li>Track progress with photos every 2 weeks and benchmark tests every 4 weeks</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-black border border-purple-900/50 rounded-lg overflow-hidden mb-16">
            <Tabs defaultValue="kaden-workout" className="w-full">
              <div className="p-6 border-b border-purple-900/30">
                <h3 className="text-2xl font-bold mb-4">Kaden's Plan</h3>
                <TabsList className="grid grid-cols-1 bg-black border border-purple-900/50">
                  <TabsTrigger value="kaden-workout" className="data-[state=active]:bg-purple-950">
                    Workout Plan
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="kaden-workout" className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Plan Overview</h4>
                    <p className="text-gray-300 mb-4">
                      Client: Kaden P.
                      <br />
                      Start Date: March 24, 2025
                      <br />
                      End Date (Phase 1): April 23, 2025
                      <br />
                      Goal: Cutting body fat and increasing muscle mass
                      <br />
                      Training Days: 5<br />
                      Focus: Generic Split
                      <br />
                      Timeline: 4 months to August 2025; multi phases
                    </p>
                    <p className="text-gray-300">
                      <span className="font-bold">Phase 1 Targets:</span>
                      <br />
                      Reduce body fat by 2-4%, increase lean mass by 1-2 lbs
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Goal-Specific Guidance</h4>
                    <p className="text-gray-300 mb-4">
                      Cutting body fat while increasing muscle mass requires a precise balance of intense strength
                      training and strategic cardio. This plan leverages your advanced lifting experience with
                      high-intensity compound lifts like bench press, squats, and deadlifts to preserve and build
                      muscle, while incorporating HIIT and steady-state cardio to torch fat and boost your metabolism.
                      Progressive overload ensures continuous strength gains, pushing your bench from 235 lbs and squat
                      from 485 lbs upward. For toning up, we've included targeted auxiliary exercises and core work to
                      enhance muscle definition and sculpt a leaner physique. Pair this with a calorie-deficit diet rich
                      in protein, stay consistent, and watch your progress unfold in the mirror—your hard work will pay
                      off by August.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Week 1 Sample</h4>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">
                        Day 1: Monday, March 24 - Training (Chest and Triceps + Cardio)
                      </h5>
                      <p className="text-sm text-gray-400 mb-2">Warm-up (5 min): Treadmill walk at 3.5 mph</p>
                      <p className="mb-2">
                        <span className="font-bold">Main (30 min):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Bench Press: 4 sets x 6-8 reps @ 188 lbs (80% 1RM)</li>
                        <li>Incline Dumbbell Press: 3 sets x 8-10 reps @ 80 lbs per dumbbell</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Auxiliary (15 min):</span>
                      </p>
                      <ul className="list-disc pl-6 mb-2 text-gray-300">
                        <li>Cable Flyes: 3 sets x 12-15 reps @ 30 lbs per side</li>
                        <li>Tricep Pushdowns: 3 sets x 10-12 reps @ 50 lbs</li>
                      </ul>
                      <p className="mb-2">
                        <span className="font-bold">Cardio (10 min):</span> Treadmill at 60-70% max heart rate (e.g., 6
                        mph)
                      </p>
                      <p className="text-sm text-gray-400">Cool-down (5 min): Chest stretch, tricep stretch</p>
                    </div>

                    <div className="mb-4 border border-purple-900/30 rounded-lg p-4">
                      <h5 className="font-bold mb-2">Day 6: March 29, 2025 (Saturday) - Training (HIIT)</h5>
                      <p className="text-sm text-gray-400 mb-2">Warm-up (5 min): Light jogging</p>
                      <p className="mb-2">
                        <span className="font-bold">Main (20 min):</span> HIIT - 30s all-out sprint (e.g., 10 mph), 30s
                        rest, repeat for 20 min
                      </p>
                      <p className="text-sm text-gray-400">Cool-down (5 min): Walking, hamstring stretch</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">Progression Notes</h4>
                    <ul className="list-disc pl-6 text-gray-300">
                      <li>
                        Main Lifts: Increase weights every 2 weeks: Bench Press and Deadlift by 5 lbs, Squat by 10 lbs
                      </li>
                      <li>Auxiliary Lifts: Increase by 2.5-5 lbs as able</li>
                      <li>HIIT: Increase duration by 2 min weekly (20 min Week 1, 22 min Week 2, etc.)</li>
                      <li>Core: Increase reps or time as strength improves</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="text-center">
            <p className="text-xl text-gray-300 mb-8">
              These are just samples. Your plan will be built specifically for you—your body, your goals, your timeline.
            </p>
            <Button asChild className="bg-purple-950 hover:bg-purple-900 text-white px-8 py-6 text-lg rounded-md">
              <Link href="/contact">Get Your Plan</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
