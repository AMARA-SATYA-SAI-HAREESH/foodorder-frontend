import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Skip in services

const api = axios.create({
  baseURL: "http://localhost:8080",
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
