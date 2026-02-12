import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getVendorProfile,
  getVendorBalance, // ADD THIS
  getWithdrawalHistory, // ADD THIS
} from "../api/vendorApi"; // Make sure path is correct

const VendorContext = createContext();

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendor must be used within VendorProvider");
  }
  return context;
};

export const VendorProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vendorBalance, setVendorBalance] = useState({
    available: 0,
    pending: 0,
    totalEarned: 0,
  });
  const [bankAccounts, setBankAccounts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getVendorProfile();
      setVendor(response.data.vendor);
      setRestaurant(response.data.restaurant);
      setIsAuthenticated(true);

      // Fetch balance and history after successful auth
      await Promise.all([fetchVendorBalance(), fetchWithdrawalHistory()]);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("vendorToken");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorBalance = async () => {
    try {
      const response = await getVendorBalance();
      console.log("Balance Response:", response.data); // ADD THIS LINE

      if (response.data?.success) {
        setVendorBalance(
          response.data.balance || {
            available: 0,
            pending: 0,
            totalEarned: 0,
          },
        );
        setBankAccounts(response.data.bankAccounts || []);
      }
    } catch (error) {
      console.error("Error fetching vendor balance:", error);
    }
  };
  const updateBalanceAfterWithdrawal = (withdrawalResponse) => {
    if (withdrawalResponse?.newBalance) {
      setVendorBalance(withdrawalResponse.newBalance);
    }
  };
  const fetchWithdrawalHistory = async () => {
    try {
      const response = await getWithdrawalHistory();
      if (response.data?.success) {
        setWithdrawals(response.data.withdrawals || []);
      }
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
      setWithdrawals([]);
    }
  };

  const login = (token, vendorData, restaurantData) => {
    localStorage.setItem("vendorToken", token);
    setVendor(vendorData);
    setRestaurant(restaurantData);
    setIsAuthenticated(true);

    // Fetch balance after login
    fetchVendorBalance();
    fetchWithdrawalHistory();
  };

  const logout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    setVendor(null);
    setRestaurant(null);
    setIsAuthenticated(false);
    // Reset balance state
    setVendorBalance({
      available: 0,
      pending: 0,
      totalEarned: 0,
    });
    setBankAccounts([]);
    setWithdrawals([]);
    window.location.href = "/vendor/login";
  };

  const updateVendorData = (newData) => {
    setVendor((prev) => ({ ...prev, ...newData }));
  };

  const updateRestaurantData = (newData) => {
    setRestaurant((prev) => ({ ...prev, ...newData }));
  };

  return (
    <VendorContext.Provider
      value={{
        vendor,
        restaurant,
        vendorBalance,
        bankAccounts,
        withdrawals,
        loading,
        isAuthenticated,
        login,
        logout,
        updateVendorData,
        updateRestaurantData,
        fetchVendorBalance,
        fetchWithdrawalHistory,
        setWithdrawals,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};
