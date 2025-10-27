import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function ComplaintsPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Complaints Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                Return and Refund Policy
              </h2>
              <p className="text-base leading-relaxed mb-4">
                At African Market Hub, we're committed to creating a trustworthy
                space for both product and service transactions. If a customer
                is not satisfied with a product they received — whether it's
                damaged, not as described, or not delivered at all — they may
                request a refund within 30 days of the delivery date. The
                product must be returned in its original condition. Refunds are
                processed once the return is confirmed.
              </p>
              <p className="text-base leading-relaxed mb-4">
                For services, if the work delivered is incomplete, not as
                agreed, or never delivered, customers can request a refund or
                revision. Each case will be reviewed based on the original
                service agreement, communication records, and delivery status.
              </p>
              <p className="text-base leading-relaxed mb-4">
                Sellers are encouraged to clearly outline their individual
                return or revision policies. Buyers should check these details
                before placing an order.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                Customer Privacy Statement
              </h2>
              <p className="text-base leading-relaxed mb-4">
                We take your privacy seriously. Whether you're buying a handmade
                product, digital item, consultation, or professional service,
                your personal information (like your name, address, email, or
                payment details) is collected only to process transactions,
                provide support, and improve your experience.
              </p>
              <p className="text-base leading-relaxed mb-4">
                We do not sell or misuse your information. Access is restricted
                to trusted team members and service providers, and your data is
                protected through secure technologies and encryption. Your trust
                is valuable to us, and we're dedicated to keeping your
                information safe and confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Customer Service and Complaints Policy
              </h2>
              <p className="text-base leading-relaxed mb-4">
                We value every user — whether you're a buyer, a product seller,
                or a service provider. If you ever face a challenge, our support
                team is ready to help.
              </p>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  How complaints are handled:
                </h3>
                <ul className="list-disc pl-6 text-base space-y-2">
                  <li>
                    First, try to resolve the issue directly with the other
                    party.
                  </li>
                  <li>
                    If there's no resolution within 3 business days, contact our
                    customer support.
                  </li>
                  <li>
                    We'll respond within 48 hours, investigate the matter, and
                    aim to resolve it within 5-7 working days.
                  </li>
                  <li>
                    If still unresolved, the issue may be escalated to a senior
                    member of our support team.
                  </li>
                  <li>
                    We believe every complaint is an opportunity to improve, and
                    we'll always treat your concerns with respect and urgency.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
