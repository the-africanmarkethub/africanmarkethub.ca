import axios from "axios";
import { LoginData, User } from "@/types/customer/auth.types";
import { headers } from "@/utils/header";
import APICall from "@/utils/ApiCall";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const loginUser = async ({
  email,
  password,
  ip_address,
  device_name,
}: LoginData): Promise<User> => {
  const { data } = await axios.post(
    `${API_URL}/login`,
    { email, password, ip_address, device_name },
    { headers, withCredentials: true }
  );

  return data;
};

export async function signUp(payload: {
  email: string;
  password: string;
  name: string;
  last_name: string;
  phone: string;
  ip_address: string;
  device_name: string;
  role: string;
}) {
  const res = await APICall("/register", "POST", payload);
  // API now returns just { message: "Registration is active" }
  // Return the whole response object for success checking
  return res;
}

export const getProfile = async () => {
  const res = await APICall("/customer/profile", "GET");
  return res;
};

export const logoutUser = async () => {
  // Clear all authentication-related data
  const localStorageKeys = [
    "accessToken",
    "refreshToken",
    "user",
    "userProfile",
    // "cart",
    "wishlist",
  ];

  localStorageKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  // Clear session storage data
  const sessionStorageKeys = [
    "email",
    "phoneNumber",
    "tempAuth",
    "verificationData",
  ];

  sessionStorageKeys.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  // Optional: Call backend logout endpoint
  try {
    // await APICall("/logout", "POST");
  } catch (error) {
    // Server logout failed - handled silently
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const getAddresses = async () => {
  const res = await APICall("/customer/addresses", "GET");
  return res;
};

export const forgotPassword = async (email: string) => {
  const res = await APICall("/forget-password", "POST", { email });
  return res;
};

export const updateProfile = async (
  userId: number,
  data: {
    name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }
) => {
  const res = await APICall(`/customer/profile/update/${userId}`, "PUT", data);
  return res;
};

export const changePassword = async (data: {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}) => {
  const res = await APICall("/change-password", "PUT", data);
  return res;
};

export const continueWithGoogle = async (googleData: {
  access_token: string;
  device_name: string;
  ip_address: string;
}) => {
  try {
    // Create FormData for the API
    const formData = new FormData();
    formData.append("access_token", googleData.access_token);
    formData.append("device_name", googleData.device_name);
    formData.append("ip_address", googleData.ip_address);

    const { data } = await axios.post(
      `${API_URL}/continue-with-google`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    // Store the authentication data
    if (data.token || data.access_token) {
      localStorage.setItem("accessToken", data.token || data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem("refreshToken", data.refresh_token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    throw error;
  }
};
