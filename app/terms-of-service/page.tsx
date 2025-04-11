import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsOfService() {
  return (
    <main className="flex flex-col min-h-screen bg-black">
      <section className="w-full py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">Last Updated: March 22, 2025</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the HARD Fitness website and services, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Services Description</h2>
            <p>
              HARD Fitness provides personalized fitness and nutrition plans designed for individual users. Our services
              include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Personalized workout plans</li>
              <li>Customized nutrition guidance</li>
              <li>Hybrid plans combining both workout and nutrition</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Subscription and Billing</h2>
            <p>
              Our services are offered on a subscription basis. By subscribing to our services, you agree to the
              following:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>You authorize us to charge the applicable fees to your payment method</li>
              <li>Subscriptions automatically renew unless canceled before the renewal date</li>
              <li>Promotional rates (including first-month discounts) apply only for the specified period</li>
              <li>You can cancel your subscription at any time through your account settings</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Refund Policy</h2>
            <p>
              We offer a satisfaction guarantee. If you are not satisfied with our services, please contact us within 14
              days of your purchase for a full refund. After this period, refunds are provided at our discretion.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. User Responsibilities</h2>
            <p>As a user of our services, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide accurate and complete information about yourself</li>
              <li>Consult with a healthcare professional before starting any fitness or nutrition program</li>
              <li>Use our services in accordance with these terms and applicable laws</li>
              <li>Maintain the confidentiality of your account credentials</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Health Disclaimer</h2>
            <p>
              Our services are not intended to replace professional medical advice, diagnosis, or treatment. Always seek
              the advice of your physician or other qualified health provider with any questions you may have regarding
              a medical condition or before beginning any fitness or nutrition program.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Intellectual Property</h2>
            <p>
              All content on our website and in our services, including text, graphics, logos, images, and software, is
              the property of HARD Fitness and is protected by copyright and other intellectual property laws. You may
              not reproduce, distribute, modify, or create derivative works from any content without our express written
              permission.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, HARD Fitness shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
              or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of
              our services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to our services at our sole
              discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to
              other users, us, or third parties, or for any other reason.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Changes to Terms</h2>
            <p>
              We may modify these Terms of Service at any time. We will notify you of any changes by posting the new
              terms on our website and updating the "Last Updated" date. Your continued use of our services after any
              changes indicates your acceptance of the modified terms.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the United
              States, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">12. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <p className="mt-4">
              Email: terms@hardfitness.com
              <br />
              Address: 123 Fitness Way, Strength City, SC 12345
            </p>
          </div>

          <div className="mt-12">
            <Button asChild className="bg-purple-950 hover:bg-purple-900 text-white">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
