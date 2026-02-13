import React, { useState, useEffect } from "react";
// import { DeviceEventEmitter } from "react-native";
import { useDriver } from "../context/DriverContext";
import driverApi from "../api/driverApi";
import { Star } from "lucide-react";
import PickupVerification from "../components/PickupVerification";
// import DeliveryVerification from "../components/DeliveryVerification";
import OTPVerification from "../components/OTPVerification";
import {
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Navigation,
  Battery,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import MapView from "../components/Map/MapView";

const DriverDashboard = () => {
  const {
    driver,
    currentOrder,
    isOnline,
    toggleOnlineStatus,
    acceptOrder,
    updateOrderStatus,
  } = useDriver();
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    todayDeliveries: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    rating: 0,
  });
  const [showPickupVerification, setShowPickupVerification] = useState(false);
  // const [showDeliveryVerification, setShowDeliveryVerification] =
  // useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [isOnline, setIsOnline] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   // Initialize mock notifications
  //   MockNotificationService.initialize();

  //   // Listen for mock notifications

  //   // Cleanup
  //   return () => subscription.remove();
  // }, []);
  // const toggleDriverStatus = async () => {
  //   try {
  //     // First set online status
  //     await driverApi.toggleOnlineStatus({ isOnline: true });

  //     // Then set availability
  //     await driverApi.setAvailability({ isAvailable: true });

  //     setIsOnline(true);
  //     setIsAvailable(true);
  //     console.log("✅ Driver is now online and available");
  //   } catch (error) {
  //     console.error("❌ Error setting driver status:", error);
  //   }
  // };
  // Add this function inside your DriverDashboard component
  //   const handleArrivedAtCustomer = async (orderId) => {
  //   try {
  //     console.log("🚗 [ARRIVAL] Calling updateOrderStatus with:", {
  //       orderId,
  //       status: "ARRIVED_AT_CUSTOMER",
  //       currentOrder: currentOrder,
  //       idToUse: orderId
  //     });
  //     const result = await updateOrderStatus(orderId, "ARRIVED_AT_CUSTOMER");
  //     if (result.success) {
  //       alert("Arrival marked! Please deliver the order to customer.");
  //       fetchDashboardData();
  //     }
  //   } catch (error) {
  //     alert("Failed to mark arrival");
  //   }
  // };

  const handleArrivedAtCustomer = async (orderId) => {
    try {
      console.log("🚗 [ARRIVAL] Generating OTP...");

      // Generate and send OTP
      const response = await fetch(
        // `http://localhost:8080/api/otp/${orderId}/generate`,
        `${process.env.REACT_APP_API_URL}/api/otp/${orderId}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        console.log("✅ OTP generated:", result.otp);
        alert(`OTP sent to customer: ${result.otp}`); // For testing
        setShowOTPVerification(true);
      } else {
        alert("Failed to generate OTP: " + result.message);
      }
    } catch (error) {
      console.error("❌ Arrival error:", error);
      alert("Error generating OTP");
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      const result = await updateOrderStatus(orderId, "DELIVERED");
      if (result.success) {
        alert("Delivery completed successfully!");
        fetchDashboardData();
      }
    } catch (error) {
      alert("Failed to complete delivery");
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, earningsRes] = await Promise.all([
        driverApi.getAvailableOrders(),
        driverApi.getEarningsSummary(),
      ]);

      if (ordersRes.data?.success) {
        setAvailableOrders(ordersRes.data.orders || []);
      }

      if (earningsRes.data?.success) {
        const earnings = earningsRes.data.summary;
        setStats({
          totalDeliveries: earnings.total?.totalDeliveries || 0,
          todayDeliveries: earnings.today?.deliveries || 0,
          totalEarnings: earnings.total?.totalEarnings || 0,
          todayEarnings: earnings.today?.earnings || 0,
          rating: 4.5, // Would come from backend
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = async () => {
    const newStatus = !isOnline;
    const result = await toggleOnlineStatus(newStatus);
    if (!result.success) {
      alert("Failed to update status");
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const result = await acceptOrder(orderId); // Now acceptOrder is already defined
      if (result.success) {
        alert("Order accepted successfully!");
        fetchDashboardData();
      }
    } catch (error) {
      alert("Failed to accept order");
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      console.log("📦 Updating order status:", { orderId, status });

      // Check if updateOrderStatus function exists in context
      // const { updateOrderStatus } = useDriver();

      // If using DriverContext's updateOrderStatus:
      const result = await updateOrderStatus(orderId, status);

      if (result.success) {
        alert(`Order status updated to ${status}`);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert(
        `Failed to update status: ${
          error.response?.data?.message || error.message
        }`,
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Notification Bell - Add at the top */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative"></div>
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {driver?.vehicleNumber}
              </h3>
              <p className="text-sm text-gray-600">{driver?.vehicleType}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              // onClick={handleToggleOnline}
              onClick={() => toggleOnlineStatus(!isOnline)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isOnline
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </button>
            {isOnline && (
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                <Navigation className="inline w-4 h-4 mr-2" />
                Navigate
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Current Order */}
      {currentOrder && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Current Order
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentOrder.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">
                {/* Order #{currentOrder._id?.slice(-6)} */}
                Order #{(currentOrder._id || currentOrder.id)?.slice(-6)}
              </h4>
              <p className="text-sm text-gray-600">
                {currentOrder.restaurantId?.name}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Delivery Address</h4>
              <p className="text-sm text-gray-600">
                {currentOrder.deliveryAddress}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Amount</h4>
              <p className="text-lg font-semibold">
                {/* ₹{currentOrder.totalAmount} */}₹
                {currentOrder.payment?.amount || 0}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {/* {currentOrder.status === "ACCEPTED" && (
              <button onClick={() => handleStatusUpdate(currentOrder._id, "PICKED_UP")}className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Pick Up Order
              </button>
            )} */}
            {currentOrder.status === "ACCEPTED" && (
              <button
                onClick={() => {
                  // setVerificationCode(""); // ✅ RESET CODE FIRST
                  setShowPickupVerification(true);
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Scan QR to Pick Up
              </button>
            )}
            {/* // ✅ ADD THIS INSTEAD: */}
            {currentOrder.status === "PICKED_UP" && !showOTPVerification && (
              <div className="space-y-3">
                <button
                  onClick={() =>
                    handleArrivedAtCustomer(currentOrder._id || currentOrder.id)
                  }
                  className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
                >
                  🚗 I've Arrived - Send OTP
                </button>
              </div>
            )}
            {currentOrder.status === "ARRIVED_AT_CUSTOMER" && (
              <button
                // onClick={() => handleCompleteDelivery(currentOrder._id)}
                onClick={() =>
                  handleCompleteDelivery(currentOrder._id || currentOrder.id)
                }
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Complete Delivery
              </button>
            )}
            <button
              onClick={() => console.log("View details:", currentOrder)}
              className="py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              View Details
            </button>
          </div>
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Deliveries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.todayDeliveries}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                {availableOrders.length} available
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{stats.todayEarnings}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                <DollarSign className="inline w-3 h-3 mr-1" />
                Total: ₹{stats.totalEarnings}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Deliveries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalDeliveries}
              </p>
              <p className="text-xs text-gray-500 mt-1">Lifetime</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.rating}
              </p>
              <p className="text-xs text-yellow-600 mt-1">⭐⭐⭐⭐⭐</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Available Orders & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Available Orders */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Available Orders
            </h2>
            <span className="text-sm text-gray-500">
              {availableOrders.length} orders
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {availableOrders.length > 0 ? (
              availableOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Order #{order._id?.slice(-6)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.restaurantId?.name}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {order.payment?.amount
                        ? `₹${order.payment.amount}`
                        : "₹0"}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{order.deliveryAddress?.substring(0, 50)}...</span>
                  </div>

                  <div className="flex gap-2">
                    {/* <button
                      onClick={() => handleAcceptOrder(order._id)}
                      
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700"
                      disabled={currentOrder}
                    >
                      Accept Order
                    </button> */}
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className={`flex-1 py-2 rounded-lg font-medium text-sm ${
                        currentOrder
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={!!currentOrder}
                      title={
                        currentOrder
                          ? "Complete current order first"
                          : "Accept this order"
                      }
                    >
                      {currentOrder ? "Already have order" : "Accept Order"}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No available orders</p>
                <p className="text-sm text-gray-500 mt-1">
                  Orders will appear when you're online
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Map
          </h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapView
              currentLocation={driver?.currentLocation}
              orders={availableOrders}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Available Orders</span>
            </div>
          </div>
        </div>
      </div>

      {showPickupVerification && (
        <>
          {console.log("🔍 [DASHBOARD] currentOrder:", {
            currentOrder,
            id: currentOrder?._id,
            status: currentOrder?.status,
            keys: currentOrder ? Object.keys(currentOrder) : "no currentOrder",
          })}
          <PickupVerification
            order={currentOrder}
            onSuccess={(result) => {
              setShowPickupVerification(false);
              fetchDashboardData(); // Refresh to show updated status
              alert("Pickup verified successfully!");
            }}
            onBack={() => setShowPickupVerification(false)}
          />
        </>
      )}
      {/* {showDeliveryVerification && (
        <DeliveryVerification
          order={currentOrder}
          onSuccess={(result) => {
            setShowDeliveryVerification(false);
            fetchDashboardData(); // Refresh to show updated status
            alert("Delivery completed successfully!");
          }}
          onBack={() => setShowDeliveryVerification(false)}
        />
      )} */}
      {/* // 6. Add OTPVerification component */}
      {showOTPVerification && (
        <OTPVerification
          order={currentOrder}
          onSuccess={(result) => {
            console.log("✅ Delivery completed:", result);
            setShowOTPVerification(false);
            fetchDashboardData();
            alert("Delivery completed successfully!");
          }}
          onBack={() => setShowOTPVerification(false)}
        />
      )}
    </div>
  );
};

export default DriverDashboard;
