import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Instagram } from "lucide-react";
import Image from "next/image";
import FooterSectionList from "./FooterSectionList";
import Link from "next/link";

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
              items={[
                { text: "About Us", href: "/about" },
                { text: "Our Branches", href: "/branches" },
                { text: "Changelog", href: "/changelog" },
              ]}
            />
            <FooterSectionList
              title="Contact us"
              items={[
                { text: "Contact Us", href: "/contact" },
                { text: "Deals", href: "/deals" },
              ]}
            />
            <FooterSectionList
              title="Legal"
              items={[
                { text: "Terms and Conditions", href: "/terms" },
                { text: "Privacy Policy", href: "/privacy" },
                { text: "Complaints Policy", href: "/complaints" },
              ]}
            />
            <FooterSectionList
              title="FAQ"
              items={[
                { text: "FAQs", href: "/faq" },
                { text: "Blog", href: "/blog" },
              ]}
            />
            <FooterSectionList
              title="Download"
              items={[
                {
                  text: "Download on Google Play Store",
                  href: "https://play.google.com/store",
                },
                {
                  text: "Download on App Store",
                  href: "https://apps.apple.com",
                },
              ]}
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
          <div className="flex gap-[15px] items-center">
            <Link
              href="https://www.instagram.com/africanmarkethub/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Instagram size={16} />
            </Link>
            <Link
              href="https://x.com/africanmkthub"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/assets/hugeicons_new-twitter.svg"
                width={16}
                height={16}
                alt="twitter"
              />
            </Link>
            <Link
              href="https://www.tiktok.com/@africanmarkethub"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}

export default Footer;
