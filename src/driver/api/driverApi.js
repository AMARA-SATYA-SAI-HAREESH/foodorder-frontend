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

// WRONG: This creates double /driver/driver/
// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/driver";

// CORRECT: Use base URL without /driver
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const driverApi = axios.create({
  baseURL: API_URL,
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
  // Auth - CORRECT: /api/driver/auth/login
  login: (credentials) => driverApi.post("/driver/auth/login", credentials),
  register: (driverData) => driverApi.post("/driver/auth/register", driverData),

  // Profile - CORRECT: /api/driver/profile
  getProfile: () => driverApi.get("/driver/profile"),

  // Location - CORRECT: /api/driver/location
  updateLocation: (locationData) =>
    driverApi.put("/driver/location", locationData),

  // Status - CORRECT: /api/driver/online-status
  toggleOnlineStatus: (statusData) =>
    driverApi.put("/driver/online-status", statusData),
  setAvailability: (availability) =>
    driverApi.put("/driver/availability", availability),

  // Orders - CORRECT: /api/driver/orders/available
  getAvailableOrders: () => driverApi.get("/driver/orders/available"),
  acceptOrder: (orderId) =>
    driverApi.post("/driver/orders/accept", { orderId }),
  getCurrentOrder: () => driverApi.get("/driver/orders/current"),
  updateOrderStatus: (orderId, statusData) =>
    // driverApi.put(`/driver/orders/${orderId}/status`, statusData),
    // driverApi.put(`/driver/orders/status?id=${orderId}`, statusData),
    driverApi.put(`/driver/orders/status`, {
      ...statusData,
      id: orderId,
    }),
  getOrderHistory: (page = 1, limit = 20) =>
    driverApi.get(`/driver/orders/history?page=${page}&limit=${limit}`),

  // Earnings - CORRECT: /api/driver/earnings/summary
  // getEarningsSummary: () => driverApi.get("/driver/earnings/summary"),
  // getPerformanceMetrics: () => driverApi.get("/driver/earnings/performance"),
  // requestWithdrawal: (withdrawalData) =>
  //   driverApi.post("/driver/earnings/withdraw", withdrawalData),
  // getWithdrawalHistory: (page = 1, limit = 20) =>
  //   driverApi.get(`/driver/earnings/withdrawals?page=${page}&limit=${limit}`),
  // // Wallet & Payout APIs
  // getWalletSummary: () => driverApi.get("/payout/wallet"),
  // getPayoutHistory: (page = 1, limit = 20) =>
  //   driverApi.get(`/payout/history?page=${page}&limit=${limit}`),
};

export default api;
