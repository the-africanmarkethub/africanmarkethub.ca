import React from "react";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FooterSectionList from "./FooterSectionList";

function Footer() {
  return (
    <footer className="bg-[#663A28] w-full pt-20 pb-12 text-[#FFFFFF]">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[140px]">
          <div>
            <Image src="/img/Logo.svg" width={142} height={48} alt="logo" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-1 gap-8 lg:justify-between">
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

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-normal">
            <p>All rights reserved.© 2025 African Market Hub</p>
          </div>
          <div className="flex items-center gap-[15px]">
            <Link href={"https://web.facebook.com/?_rdc=1&_rdr#"}>
              <Facebook size={24} />
            </Link>
            <Link href="https://www.instagram.com/">
              <Instagram size={24} />
            </Link>
            <Link href="https://x.com/">
              <Image
                src="/assets/hugeicons_new-twitter.svg"
                width={24}
                height={24}
                alt="twitter"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
