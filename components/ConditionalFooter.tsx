"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't show footer on auth pages and vendor pages
  if (pathname.startsWith("/auth") || pathname.startsWith("/vendor")) {
    return null;
  }
  
  return <Footer />;
}