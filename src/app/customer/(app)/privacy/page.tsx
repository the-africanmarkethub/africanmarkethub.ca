import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-base leading-relaxed mb-8">
              At African Market Hub, we’re committed to protecting your personal
              information —whether you’re in Canada, another part of Africa, or
              anywhere in the world.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Our Privacy Principles:
                </h2>
                <div>
                  <ul className="list-disc pl-6 text-base space-y-2">
                    <li>
                      What We Collect: Name, email, address, phone number,
                      payment info, and site usage data.
                    </li>
                    <li>
                      Why We Collect It: To support product and service
                      transactions, manage your account, communicate with you,
                      and ensure safe platform use.
                    </li>
                    <li>
                      How We Use It: Only for legitimate business purposes, and
                      only shared with partners like payment processors or
                      delivery services when necessary.
                    </li>
                    <li>
                      Your Rights: You have the right to request access to your
                      data, ask for corrections, or delete your information. We
                      will respond to your request promptly.
                    </li>
                    <li>
                      Data Protection: We use secure servers, data encryption,
                      and strict access control to keep your information safe.
                    </li>
                    <li>
                      Compliance: We follow Canadian privacy laws (like PIPEDA)
                      and apply the same high standard toall users globally.
                      Your privacy is your right, and we are committed to
                      protecting it in every transaction —whether you’re buying
                      handcrafted goods, hiring a creative designer, or listing
                      your own business services.
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
