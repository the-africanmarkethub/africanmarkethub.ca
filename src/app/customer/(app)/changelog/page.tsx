import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Changelog
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              Stay updated with the latest improvements, new features, and enhancements to African Market Hub. 
              We're constantly working to make your experience better.
            </p>
            
            <div className="space-y-8">
              <div className="border-l-4 border-blue-500 pl-6">
                <h2 className="text-2xl font-semibold mb-2">Version 2.1.0 - January 2025</h2>
                <div className="text-gray-600 mb-4">Released: January 15, 2025</div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enhanced mobile app performance and loading times</li>
                  <li>New multi-language support for 5 additional African languages</li>
                  <li>Improved search functionality with AI-powered recommendations</li>
                  <li>Added real-time chat support for buyers and sellers</li>
                  <li>Enhanced security features with two-factor authentication</li>
                  <li>New seller analytics dashboard</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h2 className="text-2xl font-semibold mb-2">Version 2.0.0 - December 2024</h2>
                <div className="text-gray-600 mb-4">Released: December 1, 2024</div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Complete platform redesign with modern UI/UX</li>
                  <li>New seller onboarding process with video tutorials</li>
                  <li>Enhanced payment processing with multiple payment methods</li>
                  <li>Improved product recommendation engine</li>
                  <li>New customer review and rating system</li>
                  <li>Mobile app launch for iOS and Android</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <h2 className="text-2xl font-semibold mb-2">Version 1.5.0 - October 2024</h2>
                <div className="text-gray-600 mb-4">Released: October 20, 2024</div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Added social media integration for product sharing</li>
                  <li>Enhanced seller verification process</li>
                  <li>Improved search filters and sorting options</li>
                  <li>New wishlist and favorites functionality</li>
                  <li>Enhanced customer support with live chat</li>
                  <li>Performance optimizations and bug fixes</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-6">
                <h2 className="text-2xl font-semibold mb-2">Version 1.0.0 - August 2024</h2>
                <div className="text-gray-600 mb-4">Released: August 15, 2024</div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Initial platform launch</li>
                  <li>Basic buyer and seller registration</li>
                  <li>Product listing and browsing functionality</li>
                  <li>Secure payment processing</li>
                  <li>Basic customer support system</li>
                  <li>Multi-currency support</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Upcoming Features</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>AI-powered product recommendations</li>
                <li>Advanced analytics for sellers</li>
                <li>Integration with local delivery services</li>
                <li>Enhanced mobile app features</li>
                <li>New payment methods including cryptocurrency</li>
                <li>Improved accessibility features</li>
              </ul>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
