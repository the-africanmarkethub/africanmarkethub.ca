import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Frequently Asked Questions
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              Find answers to the most common questions about African Market
              Hub. If you don't see your question here, please contact our
              support team.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  General Questions
                </h2>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      What is African Market Hub?
                    </h3>
                    <p>
                      African Market Hub is a digital marketplace that connects
                      buyers and sellers across Africa and beyond. We provide a
                      platform for authentic African products and services,
                      supporting local businesses while making African goods
                      accessible globally.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      How do I create an account?
                    </h3>
                    <p>
                      Creating an account is simple. Click the "Sign Up" button,
                      provide your email address, create a password, and verify
                      your email. You can also sign up using your Google or
                      Facebook account for faster registration.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      Is it free to use African Market Hub?
                    </h3>
                    <p>
                      Yes, creating an account and browsing products is
                      completely free. We only charge fees when you make a sale
                      (for sellers) or when you use premium features. All fees
                      are clearly displayed before any transaction.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">For Buyers</h2>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      How do I place an order?
                    </h3>
                    <p>
                      Browse products, add items to your cart, proceed to
                      checkout, enter your shipping information, choose a
                      payment method, and confirm your order. You'll receive a
                      confirmation email with your order details.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      What payment methods do you accept?
                    </h3>
                    <p>
                      We accept all major credit cards (Visa, Mastercard,
                      American Express), bank transfers, mobile money (M-Pesa,
                      MTN Mobile Money), PayPal, and cryptocurrency payments.
                      Payment methods vary by region for your convenience.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      How do I track my order?
                    </h3>
                    <p>
                      You can track your order through your account dashboard or
                      using the tracking number provided in your confirmation
                      email. You'll receive updates at each stage of the
                      delivery process.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      What is your return policy?
                    </h3>
                    <p>
                      We offer a 30-day return policy for most items. Items must
                      be in original condition with tags attached. Some items
                      like perishables or personalized products may not be
                      returnable. Check the specific return policy for each item
                      before purchasing.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">For Sellers</h2>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      How do I become a seller?
                    </h3>
                    <p>
                      Click "Sell with Us" and complete the seller registration
                      process. You'll need to provide business information,
                      verify your identity, and agree to our seller terms. Our
                      team will review your application and guide you through
                      the onboarding process.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      What are the seller fees?
                    </h3>
                    <p>
                      Our commission structure is competitive and transparent.
                      We charge a small percentage of each sale, with no hidden
                      fees. Premium sellers can access additional features and
                      lower commission rates. All fees are clearly displayed
                      before you list your products.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      How do I get paid?
                    </h3>
                    <p>
                      Payments are processed securely through our platform. You
                      can choose to receive payments via bank transfer, mobile
                      money, or other supported methods. Payments are typically
                      processed within 2-3 business days after order completion.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      What support do you provide to sellers?
                    </h3>
                    <p>
                      We offer comprehensive seller support including onboarding
                      assistance, marketing tools, analytics dashboards,
                      customer service training, and dedicated account managers
                      for premium sellers. Our support team is available 24/7 to
                      help you succeed.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Shipping and Delivery
                </h2>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      Do you ship internationally?
                    </h3>
                    <p>
                      Yes, we ship to most countries worldwide. Shipping costs
                      and delivery times vary by destination. Some items may
                      have shipping restrictions based on local regulations.
                      Check the shipping information for each product before
                      ordering.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      How long does delivery take?
                    </h3>
                    <p>
                      Delivery times vary by location and shipping method. Local
                      deliveries typically take 1-3 days, while international
                      shipping can take 7-21 days. Express shipping options are
                      available for faster delivery. You'll receive tracking
                      information once your order ships.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      What if my package is lost or damaged?
                    </h3>
                    <p>
                      We have insurance coverage for all shipments. If your
                      package is lost or damaged during transit, contact our
                      support team immediately. We'll investigate the issue and
                      provide a replacement or full refund as appropriate.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Security and Privacy
                </h2>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      Is my personal information secure?
                    </h3>
                    <p>
                      Yes, we use industry-standard encryption and security
                      measures to protect your personal information. We never
                      share your data with third parties without your consent,
                      and we comply with all relevant data protection
                      regulations.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      How do you protect against fraud?
                    </h3>
                    <p>
                      We have advanced fraud detection systems, secure payment
                      processing, seller verification processes, and buyer
                      protection programs. All transactions are monitored for
                      suspicious activity, and we work with law enforcement when
                      necessary.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-12 bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Still Have Questions?
              </h2>
              <p className="mb-4">
                If you couldn't find the answer to your question, our support
                team is here to help:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: support@africanmarkethub.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Live Chat: Available 24/7 on our website</li>
                <li>Help Center: Comprehensive guides and tutorials</li>
              </ul>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
