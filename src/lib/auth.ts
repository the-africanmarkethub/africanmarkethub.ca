import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface CustomJWT {
  accessToken: string;
  refreshToken: string;
  userData: User;
  accessTokenExpires?: number;
}

interface CustomUser extends User {
  accessToken: string;
  refreshToken: string;
  userData: User;
}
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !NEXTAUTH_SECRET ||
  !BACKEND_API_URL
) {
  console.error(
    "CRITICAL: One or more required environment variables for NextAuth are missing."
  );
}

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !account.id_token) return true;

      const endpoint = `${BACKEND_API_URL}/continue-with-google`;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_token: account.id_token,
            device_name: "web-browser",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const { token: backendToken, refresh_token, user: userData } = data;

          if (!backendToken) {
            console.error(
              "Backend response is missing required 'token' field."
            );
            return false;
          }

          user.accessToken = backendToken;
          user.refreshToken = refresh_token || "";
          user.userData = userData || {};

          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userData = user.userData;
      }
      return token;
    },

    // --- 3. SESSION ---
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.userData = token.userData;
      return session;
    },
  },

  // ... (pages config are the same)
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
