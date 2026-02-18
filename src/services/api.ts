// import axios from "axios";
// import { useAuth } from "../context/AuthContext"; // Skip in services
// console.log("API URL:", process.env.REACT_APP_API_URL);
// const api = axios.create({
//   baseURL: `${process.env.REACT_APP_API_URL}`,
// });

// // Auto-add JWT token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // Or from context
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

// Auto-add JWT token to requests
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("vendorToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("driverToken");

  // ✅ Add cache-busting for GET requests
  if (config.method?.toLowerCase() === "get") {
    config.params = {
      ...config.params,
      _t: Date.now(), // Prevents browser caching
    };
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle rate limit errors (429)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Rate limited by Redis
      console.error("Rate limited:", error.response.data);
    }
    return Promise.reject(error);
  },
);

export default api;
