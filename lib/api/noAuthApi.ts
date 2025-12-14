import axios from "axios";

const noAuthApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://api.afrovending.com/api/v1",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

noAuthApi.interceptors.request.use((config) => {
  config.withCredentials = false;
  return config;
});

export default noAuthApi; 
