// import { refreshAccessToken } from "@/hooks/useSignIn";
import axios from "axios";
import { toast } from "sonner";

export const Base_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function APICall(
  Url: string,
  Method: "GET" | "POST" | "PUT" | "DELETE",
  Data?: unknown,
  isFormData = false,
  timeoutOverride?: number | null,
  silent?: boolean
) {
  const authToken = localStorage.getItem("accessToken");

  // Create a clean axios instance for this request
  const axiosInstance = axios.create();

  // Set up response interceptor for this instance only
  axiosInstance.interceptors.response.use(
    (response) => {
      if (response?.data?.authorization) {
        localStorage.setItem("accessToken", response.data.authorization);
      }
      return response;
    },
    (error) => {
      console.log(error, "THE ERROR");
      // Don't return error.response, let it throw properly
      return Promise.reject(error);
    }
  );

  // Construct URL properly
  let baseUrl = Base_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
  }

  // Remove trailing slash from base URL
  baseUrl = baseUrl.replace(/\/$/, "");

  // Remove leading slash from endpoint
  const cleanUrl = Url.replace(/^\//, "");

  const fullUrl = `${baseUrl}/${cleanUrl}`;

  const response = await axiosInstance({
    method: Method,
    url: fullUrl,
    data: Data,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : undefined,
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
    // timeout: timeoutOverride || process.env.REACT_APP_REQUEST_TIMEOUT,
  });

  if (response) {
    if (!response.status) {
      if (!silent)
        toast.error("Please check your network connection and try again");
      return null;
    }

    if (response.status >= 400 && response.status < 500) {
      if (response.status === 401) {
        localStorage.clear();
        // const refreshToken = localStorage.getItem("refreshToken");
        // if (refreshToken) {
        //   const res = await refreshAccessToken();
        //   if (res) {
        //     window.location.reload();
        //   }
        // }
        //IMPLEMENT REFRESH TOKEN LOGIC HERE
        // window.location.href = "/";
      }
      toast.error(
        response?.data?.message ||
          response?.data?.responseMessage ||
          response?.data
      );
      return null;
    }

    if (response.status >= 500) {
      let message =
        "Sorry your request cannot be processed at this moment please try again later";
      if (response.data.message) {
        message = `${response.data.message}`;
      }
      if (!silent) toast.error(message);
      return null;
    }
    //
  } else {
    toast.error("Server error, please try again");
  }

  return !response
    ? null
    : response.data
    ? response.data
    : { status: "success" };
}
