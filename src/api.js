import axios from "axios";

export const apiUrl = import.meta.env.VITE_API_URL || "";

// Create axios instance with default config
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Always send cookies
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data, // Return data directly on success
  (error) => {
    // Log 401 errors
    if (error.response?.status === 401) {
      console.error("API 401 Unauthorized - Cookie likely missing or blocked.");
    }

    // Extract error message
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Request failed";

    throw new Error(message);
  }
);

// --- EXPORTED API METHODS ---

export const get = (path) => api.get(path);
export const post = (path, body) => api.post(path, body);
export const put = (path, body) => api.put(path, body);
export const del = (path) => api.delete(path);

export default api;