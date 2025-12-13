import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
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
          <h1 className="text-4xl font-bold text-center">About Us</h1>
          <div className="flex items-center justify-center space-x-2 mt-2 text-orange-100">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>›</span>
            <span>About Us</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to African Market Hub</h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              African Market Hub is your gateway to authentic African products and services. We connect buyers worldwide with talented African vendors, artisans, and service providers who offer unique, high-quality items that celebrate the rich culture and heritage of Africa.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To create a thriving marketplace that empowers African entrepreneurs and connects the world to authentic African culture through quality products and services.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading global platform for African commerce, fostering economic growth and cultural exchange while supporting local communities.
                </p>
              </div>
            </div>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What We Offer</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#F28C0D] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Authentic Products</h4>
                  <p className="text-gray-600 text-sm">
                    From traditional textiles and crafts to modern African fashion and beauty products.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#F28C0D] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Services</h4>
                  <p className="text-gray-600 text-sm">
                    Connect with skilled professionals offering everything from design to consulting services.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#F28C0D] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Transactions</h4>
                  <p className="text-gray-600 text-sm">
                    Safe and secure payment processing with buyer and seller protection.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#F28C0D] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Support</h4>
                  <p className="text-gray-600 text-sm">
                    Supporting African entrepreneurs and building stronger communities worldwide.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Commitment</h3>
              <p className="text-gray-600 leading-relaxed">
                We are committed to providing a platform that celebrates African culture, supports economic growth, and connects people across the globe. Every purchase you make helps support African entrepreneurs and their communities.
              </p>
            </section>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Have questions about African Market Hub? We'd love to hear from you!{" "}
                <Link href="/contact" className="text-[#F28C0D] hover:text-orange-600 font-medium">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}