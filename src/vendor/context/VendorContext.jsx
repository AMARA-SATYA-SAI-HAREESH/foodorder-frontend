import React, { createContext, useState, useContext, useEffect } from "react";
import { getVendorProfile } from "../api/vendorApi"; // Make sure path is correct

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
      // await Promise.all([fetchVendorBalance(), fetchWithdrawalHistory()]);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("vendorToken");
    } finally {
      setLoading(false);
    }
  };

  const login = (token, vendorData, restaurantData) => {
    localStorage.setItem("vendorToken", token);
    setVendor(vendorData);
    setRestaurant(restaurantData);
    setIsAuthenticated(true);

    // Fetch balance after login
    // fetchVendorBalance();
    // fetchWithdrawalHistory();
  };

  const logout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    setVendor(null);
    setRestaurant(null);
    setIsAuthenticated(false);
    // Reset balance state

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

        loading,
        isAuthenticated,
        login,
        logout,
        updateVendorData,
        updateRestaurantData,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};
