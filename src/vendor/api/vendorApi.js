// src/vendor/api/vendorApi.js
import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/vendor`;

// Create axios instance with interceptors
const vendorApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
vendorApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vendorToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
vendorApi.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("vendorToken");
      localStorage.removeItem("vendorData");
      window.location.href = "/vendor/login";
    }
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

// Auth APIs
export const vendorRegister = (data) =>
  axios.post(`${API_BASE_URL}/auth/register`, data);
export const vendorLogin = (data) =>
  axios.post(`${API_BASE_URL}/auth/login`, data);
export const getVendorProfile = () =>
  vendorApi.get(`${API_BASE_URL}/auth/profile`);
export const updateVendorProfile = (data) =>
  vendorApi.put(`${API_BASE_URL}/auth/profile`, data);

// Restaurant APIs
export const updateRestaurantDetails = (data) =>
  vendorApi.put("/restaurant/update", data);
export const getRestaurantStats = () => vendorApi.get("/restaurant/stats");

// Food APIs
export const getVendorFoods = () => vendorApi.get("/foods");
export const createVendorFood = (data) => vendorApi.post("/foods", data);
export const updateVendorFood = (id, data) =>
  vendorApi.put(`/foods/${id}`, data);
export const deleteVendorFood = (id) => vendorApi.delete(`/foods/${id}`);
export const toggleFoodAvailability = (id) =>
  vendorApi.put(`/foods/toggle-availability/${id}`);

// Order APIs
export const getVendorOrders = (params = {}) =>
  vendorApi.get("/orders", { params });
export const getVendorOrderDetails = (id) => vendorApi.get(`/orders/${id}`);
export const updateOrderStatus = (data) =>
  vendorApi.put("/orders/status", data);
export const acceptRejectOrder = (data) =>
  vendorApi.put("/orders/accept-reject", data);
export const getTodaysOrders = () => vendorApi.get("/orders/today");
export const getOrderStats = () => vendorApi.get("/orders/stats");

// Earnings APIs
export const getEarningsSummary = () => vendorApi.get("/earnings/summary");
export const getEarningsByDateRange = (data) =>
  vendorApi.post("/earnings/by-date-range", data);
export const getRecentTransactions = (limit = 20) =>
  vendorApi.get(`/earnings/recent-transactions?limit=${limit}`);

// Add these functions to your vendorApi.js:

// Withdrawal APIs
export const getVendorBalance = () => vendorApi.get("/withdrawal/balance");

export const getWithdrawalHistory = () => vendorApi.get("/withdrawal/history");

export const requestWithdrawal = (data) =>
  vendorApi.post("/withdrawal/request", data);

export const addBankAccount = (data) =>
  vendorApi.post("/withdrawal/bank-account", data);

export const deleteBankAccount = (accountId) =>
  vendorApi.delete(`/withdrawal/bank-account/${accountId}`);

export const setDefaultAccount = (accountId) =>
  vendorApi.put(`/withdrawal/bank-account/${accountId}/default`);

export default vendorApi;
