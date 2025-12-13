import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#8B4513] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo and Copyright */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-6">
              <Image
                src="/icon/logo.svg"
                alt="African Market Hub"
                width={200}
                height={67}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/market-hub/about"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/market-hub/tutorial"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Tutorial
                </Link>
              </li>
              <li>
                <Link
                  href="/market-hub/faq"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact us</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/market-hub/contact"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Privacy</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/market-hub/terms"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/market-hub/privacy"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Products and Download Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link
                  href="/market-hub/reviews"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Review
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Download</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-white/80 hover:text-white transition-colors block"
                >
                  Download on Google Play Store
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/80 hover:text-white transition-colors block"
                >
                  Download on App Store
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-between items-center border-t border-white/20 mt-12 pt-8">
          <p className="text-sm text-white/80 mt-8">
            All rights reserved.© 2025 African Market Hub
          </p>
          <div className="flex justify-end space-x-6">
            <a
              href="https://www.facebook.com/profile.php?id=61580801731074&ref=waios.fb_links_xma_control"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/africanmarkethub/"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C24.005 5.367 18.638.001 12.017.001zM8.449 16.988c-2.508 0-4.541-2.033-4.541-4.541s2.033-4.541 4.541-4.541 4.541 2.033 4.541 4.541-2.033 4.541-4.541 4.541zm7.058 0c-2.508 0-4.541-2.033-4.541-4.541s2.033-4.541 4.541-4.541 4.541 2.033 4.541 4.541-2.033 4.541-4.541 4.541z" />
              </svg>
            </a>
            <a
              href="https://x.com/africanmkthub"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
