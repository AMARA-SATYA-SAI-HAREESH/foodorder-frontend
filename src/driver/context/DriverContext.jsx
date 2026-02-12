import React, { createContext, useState, useContext, useEffect } from "react";
import driverApi from "../api/driverApi";

const DriverContext = createContext();

export const useDriver = () => useContext(DriverContext);

export const DriverProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [location, setLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("driverToken");
    const storedDriver = localStorage.getItem("driver"); // ✅ ADD THIS

    if (token) {
      // ✅ SET DRIVER FROM localStorage IMMEDIATELY before API call
      if (storedDriver) {
        try {
          setDriver(JSON.parse(storedDriver));
          console.log("✅ Driver restored from localStorage");
        } catch (e) {
          console.error("Failed to parse stored driver");
        }
      }

      fetchDriverProfile(); // This will update with fresh data
    } else {
      setLoading(false);
    }
  }, []);

  // const fetchDriverProfile = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await driverApi.getProfile();
  //     if (response.data?.success) {
  //       setDriver(response.data.driver);
  //       setIsOnline(response.data.driver?.isOnline || false);
  //       fetchCurrentOrder();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching driver profile:", error);
  //     if (error.response?.status === 401) {
  //       logout();
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchDriverProfile = async () => {
    try {
      setLoading(true);
      const response = await driverApi.getProfile();
      if (response.data?.success) {
        setDriver(response.data.driver);
        // ✅ ADD THIS - Update localStorage with latest driver data
        localStorage.setItem("driver", JSON.stringify(response.data.driver));
        setIsOnline(response.data.driver?.isOnline || false);
        fetchCurrentOrder();
      }
    } catch (error) {
      console.error("Error fetching driver profile:", error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const response = await driverApi.getCurrentOrder();
      if (response.data?.success) {
        setCurrentOrder(response.data.order);
      }
    } catch (error) {
      console.error("Error fetching current order:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await driverApi.login({ email, password });
      if (response.data?.success) {
        localStorage.setItem("driverToken", response.data.token);
        localStorage.setItem("driver", JSON.stringify(response.data.driver));
        setDriver(response.data.driver);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (driverData) => {
    try {
      const response = await driverApi.register(driverData);
      if (response.data?.success) {
        localStorage.setItem("driverToken", response.data.token);
        localStorage.setItem("driver", JSON.stringify(response.data.driver));
        setDriver(response.data.driver);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driver");
    localStorage.removeItem("driverNotifications");
    setDriver(null);
    setCurrentOrder(null);
    setIsOnline(false);
    window.location.href = "/driver/login";
  };

  const updateLocation = async (lat, lng, address) => {
    try {
      const response = await driverApi.updateLocation({ lat, lng, address });
      if (response.data?.success) {
        setLocation(response.data.location);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error updating location:", error);
      return { success: false };
    }
  };

  const toggleOnlineStatus = async (status) => {
    try {
      console.log("🚗 [DRIVER] Setting online status to:", status);
      console.log(
        "🔑 [DRIVER] Token:",
        localStorage.getItem("driverToken")?.slice(0, 20) + "...",
      );

      const response = await driverApi.toggleOnlineStatus({ isOnline: status });

      console.log("📊 [DRIVER] Online status response:", {
        success: response.data?.success,
        message: response.data?.message,
        driver: response.data?.driver,
        status: response.status,
      });

      if (response.data?.success) {
        setIsOnline(status);
        console.log("✅ [DRIVER] Online status updated to:", status);

        // Refresh orders if going online
        if (status === true) {
          console.log("🔄 [DRIVER] Refreshing orders after going online");
          // You might want to trigger order refresh here
        }

        return { success: true };
      }

      console.warn("⚠️ [DRIVER] API returned failure:", response.data);
      return { success: false };
    } catch (error) {
      console.error("❌ [DRIVER] Error toggling online status:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      return { success: false };
    }
  };
  const acceptOrder = async (orderId) => {
    try {
      const response = await driverApi.acceptOrder(orderId);
      if (response.data?.success) {
        setCurrentOrder(response.data.order);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error accepting order:", error);
      return { success: false };
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      console.log("🔧 [DRIVER CONTEXT] updateOrderStatus called:", {
        orderId,
        status,
        typeofOrderId: typeof orderId,
        driverToken: localStorage.getItem("driverToken")?.slice(0, 20) + "...",
      });
      const response = await driverApi.updateOrderStatus(orderId, { status });
      console.log("✅ [DRIVER CONTEXT] updateOrderStatus response:", {
        success: response.data?.success,
        message: response.data?.message,
      });

      if (response.data?.success) {
        fetchCurrentOrder();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("❌ [DRIVER CONTEXT] Error updating order status:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.config?.data,
      });
      console.error("Error updating order status:", error);
      return { success: false };
    }
  };

  return (
    <DriverContext.Provider
      value={{
        driver,
        loading,
        currentOrder,
        location,
        isOnline,
        login,
        register,
        logout,
        updateLocation,
        toggleOnlineStatus,
        acceptOrder,
        updateOrderStatus,
        fetchCurrentOrder,
        fetchDriverProfile,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};
