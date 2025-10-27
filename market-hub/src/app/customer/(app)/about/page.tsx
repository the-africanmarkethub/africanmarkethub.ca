import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            About Us
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Welcome to African Market Hub, your premier destination for
              authentic African products and services. We are dedicated to
              connecting buyers and sellers across the African continent and
              beyond, creating a vibrant marketplace that celebrates African
              culture, craftsmanship, and innovation.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Our platform serves as a bridge between traditional African
              markets and the global digital economy, empowering local
              businesses while providing customers with access to unique,
              high-quality products from across Africa.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">Our Mission</h2>
            <p className="text-lg leading-relaxed mb-6">
              To create a thriving digital marketplace that promotes African
              businesses, preserves cultural heritage, and fosters economic
              growth across the continent.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">Our Vision</h2>
            <p className="text-lg leading-relaxed mb-6">
              To become the leading e-commerce platform that connects Africa to
              the world, making African products and services accessible
              globally while supporting local communities.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">What We Offer</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Authentic African products from verified sellers</li>
              <li>Secure payment processing and buyer protection</li>
              <li>Comprehensive seller support and training</li>
              <li>Multi-language support for diverse African communities</li>
              <li>Mobile-first platform accessible across all devices</li>
              <li>Community-driven reviews and ratings system</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-8">Our Commitment</h2>
            <p className="text-lg leading-relaxed mb-6">
              We are committed to maintaining the highest standards of quality,
              security, and customer service. Our platform ensures that every
              transaction is secure, every product is authentic, and every
              customer experience is exceptional.
            </p>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
