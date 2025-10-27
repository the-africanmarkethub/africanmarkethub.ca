import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Deals & Promotions
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              Discover amazing deals and exclusive promotions on African Market Hub. 
              Save more while supporting local businesses and authentic African products.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border-l-4 border-red-500">
                <h2 className="text-2xl font-semibold mb-4 text-red-700">Flash Sales</h2>
                <p className="text-gray-700 mb-4">
                  Limited-time offers with up to 70% off on selected items. 
                  These deals are available for a short period only.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Daily flash sales from 12 PM - 2 PM</li>
                  <li>Weekend specials with extra discounts</li>
                  <li>Seasonal clearance events</li>
                  <li>New seller promotions</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-500">
                <h2 className="text-2xl font-semibold mb-4 text-green-700">Bulk Discounts</h2>
                <p className="text-gray-700 mb-4">
                  Save more when you buy in bulk. Perfect for businesses and large families.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>10% off orders over $100</li>
                  <li>20% off orders over $500</li>
                  <li>30% off orders over $1000</li>
                  <li>Free shipping on bulk orders</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Current Promotions</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-semibold">New User Welcome Bonus</span>
                  <span className="text-green-600 font-bold">20% OFF</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-semibold">Referral Program</span>
                  <span className="text-green-600 font-bold">$10 Credit</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-semibold">Loyalty Points</span>
                  <span className="text-green-600 font-bold">2x Points</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold">Free Shipping Weekend</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">How to Get the Best Deals</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">For Buyers</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Subscribe to our newsletter for exclusive deals</li>
                    <li>Follow us on social media for flash sales</li>
                    <li>Enable notifications for price drops</li>
                    <li>Join our loyalty program for member-only discounts</li>
                    <li>Use our mobile app for mobile-exclusive offers</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">For Sellers</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Participate in platform-wide sales events</li>
                    <li>Create bundle deals for better visibility</li>
                    <li>Offer seasonal promotions</li>
                    <li>Use our advertising tools for featured placement</li>
                    <li>Join our seller success program</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deals are subject to availability and may be limited in quantity</li>
                <li>Discounts cannot be combined unless otherwise stated</li>
                <li>Promotional codes must be entered at checkout</li>
                <li>Some deals may have minimum order requirements</li>
                <li>African Market Hub reserves the right to modify or cancel promotions</li>
                <li>All deals are valid for new and existing customers unless specified</li>
              </ul>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
