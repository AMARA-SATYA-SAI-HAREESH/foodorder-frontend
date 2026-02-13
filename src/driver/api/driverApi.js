// import axios from "axios";

// const API_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:8080/api/driver";

// const driverApi = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add token to requests
// driverApi.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("driverToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Handle 401 responses
// driverApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("driverToken");
//       localStorage.removeItem("driver");
//       window.location.href = "/driver/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export const api = {
//   // Auth
//   login: (credentials) => driverApi.post("/driver/auth/login", credentials),
//   register: (driverData) => driverApi.post("/driver/auth/register", driverData),

//   // Profile
//   getProfile: () => driverApi.get("/driver/auth/profile"),

//   // Location
//   updateLocation: (locationData) =>
//     driverApi.put("/driver/location", locationData),

//   // Status
//   toggleOnlineStatus: (statusData) =>
//     driverApi.put("/driver/online-status", statusData),
//   setAvailability: (availability) =>
//     driverApi.put("/driver/availability", availability),

//   // In src/driver/api/driverApi.js, update the orders section:

//   // Orders section - Add "/driver" prefix
//   getAvailableOrders: () => driverApi.get("/driver/orders/available"),
//   acceptOrder: (orderId) =>
//     driverApi.post("/driver/orders/accept", { orderId }),
//   getCurrentOrder: () => driverApi.get("/driver/orders/current"),
//   updateOrderStatus: (orderId, statusData) =>
//     driverApi.put(`/driver/orders/${orderId}/status`, statusData),
//   getOrderHistory: (page = 1, limit = 20) =>
//     driverApi.get(`/driver/orders/history?page=${page}&limit=${limit}`),

//   // Earnings
//   getEarningsSummary: () => driverApi.get("/driver/earnings/summary"),
//   getPerformanceMetrics: () => driverApi.get("/driver/earnings/performance"),
//   requestWithdrawal: (withdrawalData) =>
//     driverApi.post("/driver/earnings/withdraw", withdrawalData),
//   getWithdrawalHistory: (page = 1, limit = 20) =>
//     driverApi.get(`/driver/earnings/withdrawals?page=${page}&limit=${limit}`),
// };

// export default api;
import axios from "axios";

// Get base URL from env - could be with or without /api
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// ✅ FIX: Ensure URL ends with /api
const baseURL = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

console.log("🔧 Driver API Base URL:", baseURL); // Helpful for debugging

const driverApi = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
driverApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("driverToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle 401 responses
driverApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("driverToken");
      localStorage.removeItem("driver");
      window.location.href = "/driver/login";
    }
    return Promise.reject(error);
  },
);

export const api = {
  // Auth
  login: (credentials) => driverApi.post("/driver/auth/login", credentials),
  register: (driverData) => driverApi.post("/driver/auth/register", driverData),

  // Profile
  getProfile: () => driverApi.get("/driver/profile"),

  // Location
  updateLocation: (locationData) =>
    driverApi.put("/driver/location", locationData),

  // Status
  toggleOnlineStatus: (statusData) =>
    driverApi.put("/driver/online-status", statusData),
  setAvailability: (availability) =>
    driverApi.put("/driver/availability", availability),

  // Orders
  getAvailableOrders: () => driverApi.get("/driver/orders/available"),
  acceptOrder: (orderId) =>
    driverApi.post("/driver/orders/accept", { orderId }),
  getCurrentOrder: () => driverApi.get("/driver/orders/current"),
  updateOrderStatus: (orderId, statusData) =>
    driverApi.put(`/driver/orders/status`, {
      ...statusData,
      id: orderId,
    }),
  getOrderHistory: (page = 1, limit = 20) =>
    driverApi.get(`/driver/orders/history?page=${page}&limit=${limit}`),

  // Wallet & Payout APIs (commented out for now)
  // getWalletSummary: () => driverApi.get("/payout/wallet"),
  // getPayoutHistory: (page = 1, limit = 20) =>
  //   driverApi.get(`/payout/history?page=${page}&limit=${limit}`),
};

export default api;
