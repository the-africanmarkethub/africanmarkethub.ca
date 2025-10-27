import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Log the account object to see what's available
          // console.log("Google account data:", {
          //   providerAccountId: account.providerAccountId,
          //   access_token: account.access_token,
          //   id_token: account.id_token,
          // });

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

            // Check if user role is customer (same as normal login)
            const userRole = data.user?.role;
            if (userRole !== "customer") {
              console.error(
                "Access denied. This application is for customers only."
              );
              return false;
            }

            // Store the token and user data like normal login does
            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Store in NextAuth session for client-side access
            (user as any).accessToken = data.token;
            (user as any).userData = data.user;
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
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      (session as any).accessToken = token.accessToken;
      (session as any).userData = token.userData;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
