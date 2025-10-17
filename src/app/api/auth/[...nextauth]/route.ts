import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
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
          console.log("Google account data:", {
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            id_token: account.id_token,
          });
          
          // Send Google user info to your backend
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/continue-with-google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: account.access_token,
                id_token: account.id_token,
                device_name: "web-browser",
                ip_address: "127.0.0.1",
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            // Store the token and user data from your backend
            (user as any).accessToken = data.token || data.access_token;
            (user as any).refreshToken = data.refresh_token;
            (user as any).userData = data.user || data;
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
          } catch (e) {
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
        token.refreshToken = (user as any).refreshToken;
        token.userData = (user as any).userData;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;
      (session as any).userData = token.userData;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };