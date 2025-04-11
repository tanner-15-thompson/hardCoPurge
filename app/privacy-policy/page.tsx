import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col min-h-screen bg-black">
      <section className="w-full py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">Last Updated: March 22, 2025</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p>
              HARD Fitness ("we," "our," or "us") respects your privacy and is committed to protecting your personal
              data. This privacy policy explains how we collect, use, and safeguard your information when you visit our
              website or use our services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and other contact details you
                provide when filling out forms on our website.
              </li>
              <li>
                <strong>Fitness Information:</strong> Health data, fitness goals, physical measurements, exercise
                history, and other information you provide for the purpose of creating personalized fitness plans.
              </li>
              <li>
                <strong>Technical Information:</strong> IP address, browser type, device information, and cookies when
                you browse our website.
              </li>
              <li>
                <strong>Usage Information:</strong> How you use our website and services, including pages visited and
                actions taken.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>To create and deliver personalized fitness and nutrition plans</li>
              <li>To communicate with you about our services</li>
              <li>To process payments and manage your account</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access,
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this
              privacy policy, unless a longer retention period is required or permitted by law.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate or incomplete information</li>
              <li>The right to delete your personal information</li>
              <li>The right to restrict or object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. You can set
              your browser to refuse all or some browser cookies, but this may affect your ability to use certain
              features of our website.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or
              content of these websites. We encourage you to review the privacy policies of any third-party sites you
              visit.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              privacy policy on this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our data practices, please contact us at:</p>
            <p className="mt-4">
              Email: privacy@hardfitness.com
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
