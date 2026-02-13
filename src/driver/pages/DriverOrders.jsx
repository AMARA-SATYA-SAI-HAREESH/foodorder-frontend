import React, { useState, useEffect, useCallback } from "react";
import { useDriver } from "../context/DriverContext";
import driverApi from "../api/driverApi";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  Package,
} from "lucide-react";

const DriverOrders = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const { acceptOrder, updateOrderStatus, isOnline } = useDriver();

  useEffect(() => {
    fetchOrders();
  }, [activeTab, dateFilter]);
  // PASTE THE NEW USEEFFECT RIGHT AFTER IT:
  useEffect(() => {
    // Check if driver is online when component mounts
    console.log(
      "🚗 [DRIVER] Component mounted, checking online status:",
      isOnline,
    );
    if (!isOnline && activeTab === "available") {
      console.log("ℹ️ [DRIVER] Driver is offline, orders may not be visible");
    }
  }, [isOnline, activeTab]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      console.log("🚗 [DRIVER] Fetching orders for tab:", activeTab);
      console.log(
        "🔑 [DRIVER] Driver token exists:",
        !!localStorage.getItem("driverToken"),
      );

      if (activeTab === "available") {
        console.log("📦 [DRIVER] Calling getAvailableOrders API...");
        response = await driverApi.getAvailableOrders();

        console.log("📊 [DRIVER] Available orders API response:", {
          success: response.data?.success,
          message: response.data?.message,
          ordersCount: response.data?.orders?.length || 0,
          orders: response.data?.orders,
          status: response.status,
        });

        if (response.data?.success) {
          setOrders(response.data.orders || []);
          console.log(
            "✅ [DRIVER] Set available orders:",
            response.data.orders?.length || 0,
          );
        } else {
          console.error("❌ [DRIVER] API returned failure:", response.data);
        }
      } else if (activeTab === "current") {
        console.log("📦 [DRIVER] Calling getCurrentOrder API...");
        response = await driverApi.getCurrentOrder();

        console.log("📊 [DRIVER] Current order response:", {
          success: response.data?.success,
          order: response.data?.order,
          hasOrder: !!response.data?.order,
        });

        if (response.data?.success) {
          setOrders(response.data.order ? [response.data.order] : []);
        }
      } else if (activeTab === "history") {
        console.log("📦 [DRIVER] Calling getOrderHistory API...");
        response = await driverApi.getOrderHistory();

        console.log("📊 [DRIVER] Order history response:", {
          success: response.data?.success,
          ordersCount: response.data?.orders?.length || 0,
        });

        if (response.data?.success) {
          setOrders(response.data.orders || []);
        }
      }
    } catch (error) {
      console.error("❌ [DRIVER] Error fetching orders:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });

      if (error.response?.status === 401) {
        console.error("🔒 [DRIVER] Unauthorized - Token may be invalid");
        alert("Session expired. Please login again.");
        // Optional: Redirect to login
        // window.location.href = "/driver/login";
      }
    } finally {
      setLoading(false);
      console.log("⏱️ [DRIVER] fetchOrders completed");
    }
  }, [activeTab, dateFilter]);

  const handleAcceptOrder = async (orderId) => {
    try {
      const result = await acceptOrder(orderId);
      if (result.success) {
        alert("Order accepted successfully!");
        fetchOrders();
      }
    } catch (error) {
      alert("Failed to accept order");
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const result = await updateOrderStatus(orderId, status);
      if (result.success) {
        alert(`Order marked as ${status.toLowerCase()}`);
        fetchOrders();
      }
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      READY_FOR_PICKUP: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-3 h-3" />,
      },
      ACCEPTED: {
        color: "bg-blue-100 text-blue-800",
        icon: <Package className="w-3 h-3" />,
      },
      PICKED_UP: {
        color: "bg-purple-100 text-purple-800",
        icon: <Navigation className="w-3 h-3" />,
      },
      ON_THE_WAY: {
        color: "bg-indigo-100 text-indigo-800",
        icon: <Navigation className="w-3 h-3" />,
      },
      DELIVERED: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: <AlertCircle className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      order.restaurantId?.name?.toLowerCase().includes(searchLower) ||
      order.buyer?.userName?.toLowerCase().includes(searchLower) ||
      order.deliveryAddress?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage your delivery orders</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {["available", "current", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Orders
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by ID, restaurant, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        Order #{order._id?.slice(-8)}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} •{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{order.payment?.amount || 0} {/* ⬅️ UPDATED LINE */}
                    </p>
                    <p className="text-sm text-gray-600">Including delivery</p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Restaurant
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.restaurantId?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.restaurantId?.address}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Customer</h4>
                    <p className="text-sm text-gray-600">
                      {order.buyer?.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.buyer?.phone}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Delivery Address
                    </h4>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
                      <p className="text-sm text-gray-600 flex-1">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                {order.food && order.food.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                    <div className="space-y-2">
                      {order.food.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.quantity} × {item.foodId?.name || "Item"}
                          </span>
                          <span className="font-medium">
                            ₹{(item.foodId?.price || 0) * item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.food.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{order.food.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {activeTab === "available" && (
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                      Accept Order
                    </button>
                  )}

                  {activeTab === "current" && (
                    <>
                      {order.status === "ACCEPTED" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order._id, "PICKED_UP")
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                        >
                          Mark as Picked Up
                        </button>
                      )}
                      {order.status === "PICKED_UP" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order._id, "ON_THE_WAY")
                          }
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                        >
                          Start Delivery
                        </button>
                      )}
                      {order.status === "ON_THE_WAY" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order._id, "DELIVERED")
                          }
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </>
                  )}

                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                    View Details
                  </button>

                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                    <Navigation className="inline w-4 h-4 mr-1" />
                    Navigate
                  </button>

                  {(activeTab === "available" || activeTab === "current") && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, "CANCELLED")}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600">
            {activeTab === "available"
              ? "No available orders at the moment. Check back soon!"
              : activeTab === "current"
                ? "You don't have any active orders"
                : "No order history found"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DriverOrders;
