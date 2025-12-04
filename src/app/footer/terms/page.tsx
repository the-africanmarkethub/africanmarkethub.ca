import Image from "next/image";
import Link from "next/link";

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold text-center">Terms of Service</h1>
          <div className="flex items-center justify-center space-x-2 mt-2 text-orange-100">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>›</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Our Terms of Service are here to guide how buyers and sellers
              interact on African Market Hub. By using our platform, you agree
              to respect the rights and responsibilities outlined in these
              terms.
            </p>

            <p className="text-gray-600 text-base leading-relaxed mb-8">
              For sellers, this means delivering products and services as
              described, within agreed timelines, and providing good customer
              service. For buyers, it means making timely payments and using the
              platform respectfully and fairly. We do not allow fraudulent
              behavior, abusive communication, or misrepresentation of
              services/products. If any user violates these rules, African
              Market Hub may suspend or terminate their account to protect
              others.
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                The Terms of Service cover:
              </h2>

              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Account creation and management</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Listing and selling products or services</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Payments and fees</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Delivery and completion of work</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Dispute resolution</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#F28C0D] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Account suspension and legal compliance</span>
                </li>
              </ul>
            </div>

            {/* Additional Terms Sections */}
            {/* <div className="space-y-8 mt-12">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Account Registration and Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Users must provide accurate information during registration and maintain updated account details. You are responsible for maintaining the security of your account credentials and all activities under your account.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Product and Service Listings</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sellers must accurately describe their products or services, including pricing, availability, and delivery terms. Misleading information or counterfeit goods are strictly prohibited.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Payment Terms</h3>
                <p className="text-gray-600 leading-relaxed">
                  All transactions must be completed through our secure payment system. Platform fees apply to successful transactions. Refunds are processed according to our refund policy.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Prohibited Activities</h3>
                <p className="text-gray-600 leading-relaxed">
                  Users are prohibited from engaging in fraudulent activities, harassment, spam, intellectual property violations, or any illegal activities on the platform.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Account Termination</h3>
                <p className="text-gray-600 leading-relaxed">
                  African Market Hub reserves the right to suspend or terminate accounts that violate these terms. Users may also close their accounts at any time through their account settings.
                </p>
              </section>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Last updated:</strong> December 2025<br />
                If you have questions about these Terms of Service, please contact us at{" "}
                <Link href="/contact" className="text-[#F28C0D] hover:text-orange-600 font-medium">
                  support@africanmarkethub.ca
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
