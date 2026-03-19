import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Her istek için localStorage'daki token'ı Bearer olarak ekler.
axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosClient;

