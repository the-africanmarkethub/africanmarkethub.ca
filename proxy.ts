export default async function proxy(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // ----- READ COOKIES -----
  const cookieHeader = req.headers.get("cookie") || "";
  const token = extractCookie(cookieHeader, "token");
  const role = extractCookie(cookieHeader, "role");

  const isCustomerRoute = pathname.startsWith("/account");
  const isVendorRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // ----------------------------------------------------
  // 1. Prevent authenticated users from accessing /login or /register
  // ----------------------------------------------------
  if (isAuthRoute && token) {
    const redirectPath = role === "vendor" ? "/dashboard" : "/account";
    return Response.redirect(`${url.origin}${redirectPath}`, 302);
  }

  // ----------------------------------------------------
  // 2. Customer protected routes
  // ----------------------------------------------------
  if (isCustomerRoute) {
    if (!token) {
      const redirectUrl = new URL("/login", url.origin);
      redirectUrl.searchParams.set("redirect", pathname);
      return Response.redirect(redirectUrl.toString(), 302);
    }

    if (role !== "customer") {
      return Response.redirect(`${url.origin}/unauthorized`, 302);
    }
  }

  // ----------------------------------------------------
  // 3. Vendor protected routes
  // ----------------------------------------------------
  if (isVendorRoute) {
    if (!token) {
      const redirectUrl = new URL("/login", url.origin);
      redirectUrl.searchParams.set("redirect", pathname);
      return Response.redirect(redirectUrl.toString(), 302);
    }

    if (role !== "vendor") {
      return Response.redirect(`${url.origin}/unauthorized`, 302);
    }
  }

  // ----------------------------------------------------
  // 4. Public routes → allowed
  // ----------------------------------------------------
  return;
}

// ----- Cookie Reader -----
function extractCookie(cookieString: string, name: string): string | null {
  const match = cookieString.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export const config = {
  matcher: [
    // Auth pages
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/confirm-email",
    "/confirm-reset-code",

    // Customer section
    "/account/:path*",

    // Vendor section
    "/dashboard/:path*",
  ],
};
