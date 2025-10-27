import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Contact Us
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              We're here to help! Get in touch with our team for any questions, support, or feedback. 
              We're committed to providing excellent customer service and are always happy to hear from you.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">General Inquiries</h3>
                    <p className="text-gray-700">Email: info@africanmarkethub.com</p>
                    <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Customer Support</h3>
                    <p className="text-gray-700">Email: support@africanmarkethub.com</p>
                    <p className="text-gray-700">Phone: +1 (555) 123-4568</p>
                    <p className="text-gray-700">Hours: 24/7 Online Support</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Business Partnerships</h3>
                    <p className="text-gray-700">Email: partnerships@africanmarkethub.com</p>
                    <p className="text-gray-700">Phone: +1 (555) 123-4569</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Office Locations</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Headquarters</h3>
                    <p className="text-gray-700">123 Business District</p>
                    <p className="text-gray-700">Lagos, Nigeria</p>
                    <p className="text-gray-700">+234 800 123 4567</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Regional Office</h3>
                    <p className="text-gray-700">456 Commerce Street</p>
                    <p className="text-gray-700">Nairobi, Kenya</p>
                    <p className="text-gray-700">+254 700 123 456</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-4">Quick Response Times</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2 hours</div>
                  <div className="text-gray-700">Email Response</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5 minutes</div>
                  <div className="text-gray-700">Live Chat</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-gray-700">Support Available</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg">How do I become a seller?</h3>
                  <p className="text-gray-700">Visit our seller registration page and complete the verification process. Our team will guide you through each step.</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg">What payment methods do you accept?</h3>
                  <p className="text-gray-700">We accept all major credit cards, bank transfers, mobile money, and cryptocurrency payments.</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg">How do I track my order?</h3>
                  <p className="text-gray-700">You can track your order through your account dashboard or by using the tracking number provided in your confirmation email.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
