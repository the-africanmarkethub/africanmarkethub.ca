// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Import from your new config file

const handler = NextAuth(authOptions);

// Export the request handlers
export { handler as GET, handler as POST };