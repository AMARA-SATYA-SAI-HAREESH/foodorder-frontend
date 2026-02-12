import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const payoutApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

payoutApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("driverToken") ||
    localStorage.getItem("vendorToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ========== WALLET APIs ==========
export const getWalletSummary = async (userType) => {
  try {
    const endpoint =
      userType === "driver" ? "/driver/wallet" : "/vendor/withdrawal/balance";
    const response = await payoutApi.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getHoldBalance = async (userType) => {
  try {
    const endpoint =
      userType === "driver"
        ? "/driver/earnings/hold-balance"
        : "/vendor/earnings/hold-balance";
    const response = await payoutApi.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ========== BANK ACCOUNT APIs ==========
export const getBankAccounts = async (userType) => {
  try {
    const endpoint =
      userType === "driver"
        ? "/driver/bank-accounts"
        : "/vendor/withdrawal/bank-accounts";
    const response = await payoutApi.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addBankAccount = async (userType, bankData) => {
  try {
    const endpoint =
      userType === "driver"
        ? "/driver/bank-accounts"
        : "/vendor/withdrawal/bank-account";
    const response = await payoutApi.post(endpoint, bankData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteBankAccount = async (userType, accountId) => {
  try {
    const endpoint =
      userType === "driver"
        ? `/driver/bank-accounts/${accountId}`
        : `/vendor/withdrawal/bank-account/${accountId}`;
    const response = await payoutApi.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const setDefaultBankAccount = async (userType, accountId) => {
  try {
    const endpoint =
      userType === "driver"
        ? `/driver/bank-accounts/${accountId}/default`
        : `/vendor/withdrawal/bank-account/${accountId}/default`;
    const response = await payoutApi.put(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ========== UPI APIs ==========
export const addUPI = async (userType, upiData) => {
  try {
    const endpoint =
      userType === "driver" ? "/driver/upi" : "/vendor/withdrawal/upi";
    const response = await payoutApi.post(endpoint, upiData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyUPI = async (upiId) => {
  try {
    const response = await payoutApi.post("/verify/upi", { upiId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ========== WITHDRAWAL APIs ==========
export const requestWithdrawal = async (userType, withdrawalData) => {
  try {
    const endpoint =
      userType === "driver"
        ? "/driver/earnings/withdraw"
        : "/vendor/withdrawal/request";
    const response = await payoutApi.post(endpoint, withdrawalData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getWithdrawalHistory = async (userType, page = 1) => {
  try {
    const endpoint =
      userType === "driver"
        ? `/driver/earnings/withdrawals?page=${page}`
        : `/vendor/withdrawal/history?page=${page}`;
    const response = await payoutApi.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ========== HOLD/ESCROW APIs ==========
export const getHoldReleaseSchedule = async (userType) => {
  try {
    const endpoint =
      userType === "driver"
        ? "/driver/earnings/hold-schedule"
        : "/vendor/earnings/hold-schedule";
    const response = await payoutApi.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ========== AUTO-PAYOUT SETTINGS ==========
export const getAutoPayoutSettings = async (userType) => {
  try {
    const endpoint =
      userType === "driver"
        ? "/driver/auto-payout-settings"
        : "/vendor/auto-payout-settings";
    const response = await payoutApi.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAutoPayoutSettings = async (userType, settings) => {
  try {
    const endpoint =
      userType === "driver"
        ? "/driver/auto-payout-settings"
        : "/vendor/auto-payout-settings";
    const response = await payoutApi.put(endpoint, settings);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default payoutApi;
