import { NextResponse } from "next/server";

export default async function proxy(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (process.env.MAINTENANCE_MODE === "true") {
    const isPublic =
      pathname.startsWith("/_next") ||
      pathname.startsWith("/maintenance") ||
      pathname.includes("/api/health");
    if (!isPublic) {
      url.pathname = "/maintenance";
      return NextResponse.rewrite(url);
    }
  }

  // 2. Extract Data from Cookies
  const cookieHeader = req.headers.get("cookie") || "";
  const token = extractCookie(cookieHeader, "token");
  const role = extractCookie(cookieHeader, "role");

  // Route Definitions
  const isAuthRoute = pathname.match(
    /^\/(login|register|forgot-password|reset-password)/,
  );
  const isVendorRoute = pathname.startsWith("/dashboard");
  const isOnboardingRoute = pathname.startsWith("/seller-onboarding");
  const isCustomerRoute = pathname.startsWith("/account");

  // 3. Logic: Authenticated User Redirects
  if (isAuthRoute && token) {
    const home = role === "vendor" ? "/dashboard" : "/account";
    return NextResponse.redirect(new URL(home, url.origin));
  }

  // 4. Logic: Vendor/Onboarding Protection
  if (isVendorRoute || isOnboardingRoute) {
    if (!token) {
      const loginUrl = new URL("/login", url.origin);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Only vendors allowed in dashboard
    if (isVendorRoute && role !== "vendor") {
      return NextResponse.redirect(new URL("/unauthorized", url.origin));
    }
  }

  // 5. Logic: Customer Protection
  if (isCustomerRoute) {
    if (!token || role !== "customer") {
      const target = !token ? "/login" : "/unauthorized";
      return NextResponse.redirect(new URL(target, url.origin));
    }
  }

  return NextResponse.next();
}

// ----- Cookie Reader -----
function extractCookie(cookieString: string, name: string): string | null {
  const match = cookieString.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/confirm-email",
    "/confirm-reset-code",
    "/account/:path*",
    "/dashboard/:path*",
    "/seller-onboarding/:path*",
  ],
};
