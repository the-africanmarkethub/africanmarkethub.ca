import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Our Branches
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              African Market Hub operates across multiple locations to serve our diverse community of buyers and sellers. 
              Our physical branches provide local support, product verification, and customer service.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Lagos, Nigeria</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> 123 Victoria Island, Lagos, Nigeria
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> +234 800 123 4567
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> lagos@africanmarkethub.com
                </p>
                <p className="text-gray-700">
                  <strong>Hours:</strong> Mon-Fri: 8AM-6PM, Sat: 9AM-4PM
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Nairobi, Kenya</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> 456 Westlands, Nairobi, Kenya
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> +254 700 123 456
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> nairobi@africanmarkethub.com
                </p>
                <p className="text-gray-700">
                  <strong>Hours:</strong> Mon-Fri: 8AM-6PM, Sat: 9AM-4PM
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Cape Town, South Africa</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> 789 V&A Waterfront, Cape Town, South Africa
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> +27 21 123 4567
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> capetown@africanmarkethub.com
                </p>
                <p className="text-gray-700">
                  <strong>Hours:</strong> Mon-Fri: 8AM-6PM, Sat: 9AM-4PM
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Accra, Ghana</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> 321 Labone, Accra, Ghana
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> +233 30 123 4567
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> accra@africanmarkethub.com
                </p>
                <p className="text-gray-700">
                  <strong>Hours:</strong> Mon-Fri: 8AM-6PM, Sat: 9AM-4PM
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Services Available at Our Branches</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product verification and quality assurance</li>
                <li>Seller onboarding and training</li>
                <li>Customer support and dispute resolution</li>
                <li>Payment processing and financial services</li>
                <li>Logistics and shipping coordination</li>
                <li>Business development and partnership opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
