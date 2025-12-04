"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on auth pages and vendor pages
  if (pathname.startsWith("/auth") || pathname.startsWith("/vendor")) {
    return null;
  }
  
  return <Header />;
}