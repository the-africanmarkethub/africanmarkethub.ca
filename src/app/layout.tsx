import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/vendor/theme-provider";
import Common from "@/utils/common";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/vendor/auth-context";
import { ErrorBoundary } from "@/components/vendor/error-boundary";
import { CartProvider } from "@/contexts/customer/CartContext";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const lufga = localFont({
  src: [
    {
      path: "../../public/fonts/lufga/LufgaRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaMedium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaSemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lufga",
});

export const metadata: Metadata = {
  title: "African Market Hub",
  description: "African Market Hub - Connect customers and vendors across Africa",
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
            <NextAuthProvider>
              <AuthProvider>
                <CartProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                  >
                    {children}
                  </ThemeProvider>
                </CartProvider>
              </AuthProvider>
            </NextAuthProvider>
          </Common>
        </ErrorBoundary>
      </body>
    </html>
  );
}
