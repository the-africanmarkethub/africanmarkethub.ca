import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white py-16 overflow-hidden">
        <Image
          src="/icon/banner.svg"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>
          <div className="flex items-center justify-center space-x-2 mt-2 text-orange-100">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>›</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Welcome to African Market Hub, the trusted platform connecting
              African vendors in Canada with customers who appreciate authentic
              African products and services. We are committed to providing a
              safe, transparent, and reliable marketplace for both buyers and
              sellers. Please read the following policies carefully to
              understand your rights, responsibilities, and how we ensure trust
              and safety on our platform.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  1. Terms and Conditions
                </h2>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Overview
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  By using African Market Hub, you agree to abide by our terms
                  and conditions. These terms govern your access to and use of
                  our platform, products, and services.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  For Buyers
                </h3>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Buyers agree to provide accurate and up-to-date
                      information when creating an account or placing orders.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Buyers are responsible for reviewing product descriptions
                      and seller policies before making a purchase.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Payment must be made through our secure payment system for
                      buyer protection.
                    </span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  For Sellers
                </h3>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Sellers must register using valid business or personal
                      identification and contact information.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      All sellers are screened and verified by African Market
                      Hub before being approved to list products or services.
                      Verification includes confirmation of identity, business
                      registration (where applicable), and product/service
                      authenticity.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Sellers agree to list accurate descriptions, images, and
                      prices for their products or services.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Sellers must comply with our content and conduct
                      guidelines — counterfeit goods, fraudulent listings, or
                      misleading information are strictly prohibited.
                    </span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Marketplace Oversight
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  African Market Hub reserves the right to:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Suspend or terminate accounts that violate our policies.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Remove listings that are fraudulent, inappropriate, or
                      unsafe.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Intervene in disputes between buyers and sellers when
                      necessary to ensure fair resolution.
                    </span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  2. Privacy Policy
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We take your privacy seriously and are committed to protecting
                  your personal information.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Information We Collect
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  We may collect the following types of information:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      <strong>Personal Information:</strong> Name, email
                      address, phone number, billing and shipping address.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      <strong>Account Data:</strong> Login credentials,
                      preferences, and transaction history.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      <strong>Payment Information:</strong> Processed securely
                      through third-party payment providers; we do not store
                      complete card details.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      <strong>Usage Data:</strong> Device type, browser
                      information, IP address, and site interaction data for
                      analytics and performance improvement.
                    </span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How We Use Your Information
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  Your information is used to:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Process and complete transactions.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Communicate updates about orders, refunds, and support
                      inquiries.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Improve our services, user experience, and marketplace
                      features.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Verify identities and prevent fraud.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Comply with legal and regulatory requirements.</span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Information Sharing
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  We may share your information only with:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Verified sellers or service providers involved in your
                      transaction.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Trusted third-party partners who help operate our platform
                      (e.g., payment processors, logistics companies).
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Law enforcement or regulators when legally required.
                    </span>
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We do not sell or lease your personal information to third
                  parties.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  User Rights & Choices
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Access and update your personal information.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Request deletion of your account.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Withdraw consent for marketing communications.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Request a copy of your stored data by contacting our
                      support team.
                    </span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Data Security and Retention
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Your information is protected through encryption, secure
                  servers, and restricted access. We retain data only as long as
                  necessary for business, legal, or regulatory purposes, after
                  which it is safely deleted or anonymized.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  3. Return and Refund Policy
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We aim to ensure fairness and satisfaction for every
                  transaction on African Market Hub.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Products
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you receive a product that is damaged, not as described,
                  defective, or not delivered, you may request a refund within
                  30 days of delivery.
                </p>

                <h4 className="font-semibold text-gray-900 mb-2">
                  Return Process:
                </h4>
                <ol className="space-y-2 text-gray-600 mb-6 ml-6">
                  <li className="flex items-start space-x-3">
                    <span className="font-medium text-[#F28C0D] flex-shrink-0">
                      1.
                    </span>
                    <span>
                      Contact our Customer Support via Email:
                      support@africanmarkethub.ca, or complete the Return
                      Request Form on our website.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-medium text-[#F28C0D] flex-shrink-0">
                      2.
                    </span>
                    <span>
                      We will review your request within 48 hours and guide you
                      through the next steps.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-medium text-[#F28C0D] flex-shrink-0">
                      3.
                    </span>
                    <span>
                      Products should be returned either by mail to the seller's
                      provided return address or through a designated return
                      location (where available).
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-medium text-[#F28C0D] flex-shrink-0">
                      4.
                    </span>
                    <span>
                      Refunds are processed once the return is verified and
                      approved by both the seller and African Market Hub.
                    </span>
                  </li>
                </ol>

                <p className="text-gray-600 leading-relaxed mb-6">
                  <strong>Note:</strong> All sellers on African Market Hub are
                  required to comply with our refund policy. Individual seller
                  policies may provide additional details but cannot override
                  these core consumer rights.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Services
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  If a service is incomplete, not delivered, or significantly
                  different from what was agreed, customers may request a refund
                  or revision. African Market Hub will mediate the process and
                  ensure a fair review based on the service agreement,
                  communication records, and delivery status.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  4. Customer Service and Complaints Policy
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We value every user — buyers, sellers, and service providers —
                  and are committed to resolving all issues promptly and fairly.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How to Make a Complaint
                </h3>
                <ol className="space-y-2 text-gray-600 mb-6 ml-6">
                  <li className="flex items-start space-x-3">
                    <span className="font-medium text-[#F28C0D] flex-shrink-0">
                      1.
                    </span>
                    <span>
                      First, try to resolve the issue directly with the other
                      party through our platform messaging.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-medium text-[#F28C0D] flex-shrink-0">
                      2.
                    </span>
                    <span>
                      If unresolved within 3 business days, contact our Customer
                      Support at support@africanmarkethub.ca
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-medium text-[#F28C0D] flex-shrink-0">
                      3.
                    </span>
                    <span>
                      Our team will respond within 48 hours, investigate, and
                      aim to resolve the issue within 5–7 working days.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="font-medium text-[#F28C0D] flex-shrink-0">
                      4.
                    </span>
                    <span>
                      Complex cases may be escalated to a senior resolution
                      specialist.
                    </span>
                  </li>
                </ol>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Information Collected During a Complaint
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  To resolve disputes or fraud, we may collect:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Communication records between buyer and seller.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Transaction details, proof of payment, and delivery
                      confirmation.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Relevant identification documents (when required by law or
                      financial institutions).
                    </span>
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed mb-6">
                  All information collected during investigations is handled
                  securely and confidentially.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Fraud and Misconduct Handling
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  African Market Hub takes fraud seriously. If fraud or
                  unauthorized activity is detected:
                </p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      The affected account may be suspended pending
                      investigation.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Evidence will be reviewed and, if necessary, shared with
                      law enforcement or banking partners.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Proven fraudulent activities will result in account
                      termination and potential legal action.
                    </span>
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  We treat every complaint as an opportunity to improve — and
                  we'll always handle your concerns with respect, urgency, and
                  transparency.
                </p>
              </section>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Last updated:</strong> December 2025
                <br />
                If you have questions about this Privacy Policy, please contact
                us at{" "}
                <Link
                  href="/market-hub/contact"
                  className="text-[#F28C0D] hover:text-orange-600 font-medium"
                >
                  support@africanmarkethub.ca
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
