import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Terms and Conditions
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-base leading-relaxed mb-8">
              Our Terms of Service are here to guide how buyers and sellers
              interact on African Market Hub. By using our platform, you agree
              to respect the rights and responsibilities outlined in these
              terms.
            </p>

            <p className="text-base leading-relaxed mb-8">
              For sellers, this means delivering products and services as
              described, within agreed timelines, and providing good customer
              service. For buyers, it means making timely payments and using the
              platform respectfully and fairly. We do not allow fraudulent
              behavior, abusive communication, or misrepresentation of
              services/products. If any user violates these rules, African
              Market Hub may suspend or terminate their account to protect
              others.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">
              The Terms of Service cover:
            </h2>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li>Account creation and management</li>
              <li>Listing and selling products or services</li>
              <li>Payments and fees</li>
              <li>Delivery and completion of work</li>
              <li>Dispute resolution</li>
              <li>Account suspension and legal compliance</li>
            </ul>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
