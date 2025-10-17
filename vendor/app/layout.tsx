import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import Common from "@/utils/common";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";

const lufga = localFont({
  src: [
    {
      path: "../public/fonts/lufga/LufgaRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/lufga/LufgaMedium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/lufga/LufgaSemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/lufga/LufgaBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lufga",
});

export const metadata: Metadata = {
  title: "Market Hub Vendor",
  description: "Market Hub Vendor Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen w-full font-lufga antialiased",
          lufga.variable
        )}
      >
        <ErrorBoundary>
          <Common>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </AuthProvider>
          </Common>
        </ErrorBoundary>
      </body>
    </html>
  );
}
