// Utility functions for authentication

export function clearAuthData() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("redirectUrl");
}

export function clearVendorAuthData() {
  localStorage.removeItem("vendorAccessToken");
  localStorage.removeItem("vendorRefreshToken");
}

// Use the consolidated getAuthToken from header.ts
export { getAuthToken, getCustomerToken, getVendorToken } from "./header";

export function isTokenExpired(token: string): boolean {
  // Check if token looks like Laravel Sanctum token (format: id|hash)
  if (token.includes("|")) {
    // Laravel Sanctum tokens don't have built-in expiration
    // They expire based on server-side configuration
    // Return false to let the server validate it
    return false;
  }

  try {
    // Basic JWT decode (for exp claim)
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    if (!decoded.exp) return false; // No expiry, assume valid

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    // Invalid token format for JWT, but might be valid for other token types
    // Let the server validate it
    return false;
  }
}
