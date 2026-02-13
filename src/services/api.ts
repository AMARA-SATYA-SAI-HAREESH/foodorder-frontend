import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Skip in services
console.log("API URL:", process.env.REACT_APP_API_URL);
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

// Auto-add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Or from context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
