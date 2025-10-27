// Utility functions for authentication

export function clearAuthData() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("redirectUrl");
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function isTokenExpired(token: string): boolean {
  try {
    // Basic JWT decode (for exp claim)
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    if (!decoded.exp) return false; // No expiry, assume valid

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    // Invalid token format
    return true;
  }
}
