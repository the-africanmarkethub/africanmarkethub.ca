interface AuthHeaders {
  Authorization: string;
  "Content-Type": string;
  accept: string;
}

export const authHeaders = (token: string): AuthHeaders => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  accept: "application/json",
});

export const headers = {
  "Content-Type": "application/json",
  accept: "application/json",
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Priority order: customer token first, then vendor token, then legacy tokens
    return localStorage.getItem("accessToken") || 
           localStorage.getItem("vendorAccessToken") ||
           localStorage.getItem("token") || 
           sessionStorage.getItem("token");
  }
  return null;
};

// Get customer-specific token
export const getCustomerToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Get vendor-specific token  
export const getVendorToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("vendorAccessToken");
  }
  return null;
};
