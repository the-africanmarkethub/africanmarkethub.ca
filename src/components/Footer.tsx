import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import FooterSectionList from "./FooterSectionList";

function Footer() {
  return (
    <footer className="bg-[#663A28] w-full text-[#FFFFFF] pt-20 pb-12">
      <MaxWidthWrapper className="space-y-8 w-full">
        {/* Header sections - horizontal layout on both desktop and mobile */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[140px] w-full">
          <div className="flex-shrink-0">
            <Image src="/img/Logo.svg" width={142} height={48} alt="logo" />
          </div>
          <div className="grid grid-cols-2 lg:flex lg:flex-nowrap w-full lg:justify-between gap-6 lg:gap-0">
            <FooterSectionList
              title="About"
              items={["About Us", "Our Branches", "Changelog"]}
            />
            <FooterSectionList
              title="Contact us"
              items={["Contact Us", "Deals"]}
            />
            <FooterSectionList
              title="Privacy"
              items={["Terms of Privacy", "Privacy Policy", "Security"]}
            />
            <FooterSectionList title="FAQ" items={["FAQs", "Blog"]} />
            <FooterSectionList
              title="Download"
              items={["Download on Google Play Store", "Download on App Store"]}
            />
          </div>
        </div>

        {/* Bottom section with copyright and social icons */}
        <div className="flex sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="font-normal text-sm">
            <p className="text-[8px] sm:text-sm">
              All rights reserved.© 2025 African Market Hub
            </p>
          </div>
          <div className="sm:flex hidden gap-[15px] items-center">
            <Facebook size={24} />
            <Instagram size={24} />
            <Image
              src="/assets/hugeicons_new-twitter.svg"
              width={24}
              height={24}
              alt="twitter"
            />
          </div>
          <div className="flex gap-[15px] items-center">
            <Facebook size={16} />
            <Instagram size={16} />
            <Image
              src="/assets/hugeicons_new-twitter.svg"
              width={16}
              height={16}
              alt="twitter"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}

export default Footer;
