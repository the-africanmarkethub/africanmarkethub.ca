import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Send Google user info to your backend as form-data
          const formData = new FormData();
          formData.append("access_token", account.access_token || "");
          formData.append("device_name", "web-browser");
          formData.append("ip_address", "127.0.0.1");

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/continue-with-google`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Google auth response data:", data);

            // Store user data for later use in redirect
            const userRole = data.user?.role;
            console.log("User role from backend:", userRole);

            // Note: localStorage is not available in server-side callbacks
            // We'll store this data in the session instead

            // Store in NextAuth session for client-side access
            (user as any).accessToken = data.token;
            (user as any).userData = data.user;
            (user as any).userRole = userRole;
            
            return true;
          }

          // Log error details
          console.error("Backend API error:", {
            status: response.status,
            statusText: response.statusText,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/continue-with-google`,
          });

          try {
            const errorData = await response.json();
            console.error("Backend error response:", errorData);
          } catch {
            console.error("Could not parse error response");
          }

          return false;
        } catch (error) {
          console.error("Error sending Google auth to backend:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.userData = (user as any).userData;
        token.userRole = (user as any).userRole;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      (session as any).accessToken = token.accessToken;
      (session as any).userData = token.userData;
      (session as any).userRole = token.userRole;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // We'll handle role-based redirects in the client components
      // since we don't have access to user role in this callback
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };