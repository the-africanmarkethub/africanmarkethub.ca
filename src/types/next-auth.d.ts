// This file is used for NextAuth.js (Auth.js) Module Augmentation.
import { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";
import { JWT } from "next-auth/jwt";

// ----------------------------------------------------------------
// 1. Extend the JWT type
// ----------------------------------------------------------------
declare module "next-auth/jwt" {
  // We are defining the shape of the token inside the next-auth JWT.
  interface JWT extends Record<string, unknown> {
    accessToken: string;
    refreshToken: string;
    userData: DefaultUser; // Using DefaultUser if your custom data is similar
    accessTokenExpires?: number;
    // Note: The CustomJWT interface from your auth.ts file is now defined here.
  }
}

// ----------------------------------------------------------------
// 2. Extend the Session type
// ----------------------------------------------------------------
declare module "next-auth" {
  // We are defining the shape of the session object exposed by useSession().
  interface Session {
    user: {
      // You can extend the user object here too if needed
    } & DefaultSession["user"];
    
    // Add custom session fields directly to the Session root
    accessToken: string;
    userData: DefaultUser;
    // Note: Do NOT expose refreshToken to the client session!
  }

  // ----------------------------------------------------------------
  // 3. Extend the User type (for the 'user' object in callbacks)
  // ----------------------------------------------------------------
  interface User extends DefaultUser {
    // These properties are added to the 'user' object *only* during the sign-in process
    // and are immediately transferred to the JWT in the 'jwt' callback.
    accessToken: string;
    refreshToken: string;
    userData: DefaultUser;
  }
}