import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Order } from "../types";
import {
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Package,
  UserCheck,
  ChefHat,
  Receipt,
  CreditCard,
  Phone,
  Navigation,
  Shield,
  Bell,
  Calendar,
  Hash,
  TrendingUp,
  PieChart,
  Filter,
  ChevronDown,
} from "lucide-react";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const { token } = useAuth();

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/order/getMyOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Orders data:", res.data);

      // Sort orders by creation date (newest first)
      const sortedOrders = (res.data.orders || []).sort(
        (a: Order, b: Order) => {
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        },
      );

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Orders fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Replace the current handleClearHistory function with this:
  const handleClearHistory = async () => {
    try {
      if (selectedOrders.length > 0) {
        // Clear selected orders from backend
        const res = await api.post(
          "/api/order/clear-history",
          { orderIds: selectedOrders }, // This is the request body
          {
            headers: { Authorization: `Bearer ${token}` }, // This is the config object
          },
        );

        if (res.data.status) {
          // Remove selected orders from display
          setOrders((prevOrders) =>
            prevOrders.filter((order) => !selectedOrders.includes(order._id)),
          );
          alert(`✅ ${res.data.message}`);
        } else {
          alert(`❌ ${res.data.message}`);
        }
      } else {
        // Clear all completed orders from backend
        const res = await api.post(
          "/api/order/clear-history",
          { orderIds: [] }, // Send empty array instead of empty object
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (res.data.status) {
          // Remove completed orders from display
          setOrders([]);
          alert(`✅ ${res.data.message}`);
        } else {
          alert(`❌ ${res.data.message}`);
        }
      }

      setSelectedOrders([]);
      setShowClearConfirmation(false);
    } catch (error) {
      console.error("Error clearing history:", error);
      alert("Failed to clear history. Please try again.");

      // Fallback to client-side clearing if API fails
      if (selectedOrders.length > 0) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => !selectedOrders.includes(order._id)),
        );
      } else {
        setOrders((prevOrders) =>
          prevOrders.filter(
            (order) =>
              order.status !== "DELIVERED" && order.status !== "CANCELLED",
          ),
        );
      }

      setSelectedOrders([]);
      setShowClearConfirmation(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        fetchOrders();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [token]);

  // Filter orders based on selected filter
  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === "all") return true;

    // Map filter names to actual status values
    const statusMap: Record<string, string> = {
      Active: "PREPARING",
      "On the Way": "OUT_FOR_DELIVERY",
      Arrived: "ARRIVED_AT_CUSTOMER",
      Completed: "DELIVERED",
      Cancelled: "CANCELLED",
    };

    const actualStatus = statusMap[selectedFilter] || selectedFilter;
    return order.status === actualStatus;
  });

  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; bg: string; icon: React.ReactNode; label: string }
    > = {
      DELIVERED: {
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200",
        icon: <CheckCircle className="w-5 h-5" />,
        label: "Delivered",
      },
      OUT_FOR_DELIVERY: {
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200",
        icon: <Truck className="w-5 h-5" />,
        label: "On the Way",
      },
      ARRIVED_AT_CUSTOMER: {
        color: "text-purple-600",
        bg: "bg-purple-50 border-purple-200",
        icon: <Package className="w-5 h-5" />,
        label: "Arrived",
      },
      PREPARING: {
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200",
        icon: <ChefHat className="w-5 h-5" />,
        label: "Preparing",
      },
      PENDING: {
        color: "text-slate-600",
        bg: "bg-slate-50 border-slate-200",
        icon: <Clock className="w-5 h-5" />,
        label: "Pending",
      },
      CANCELLED: {
        color: "text-rose-600",
        bg: "bg-rose-50 border-rose-200",
        icon: <XCircle className="w-5 h-5" />,
        label: "Cancelled",
      },
      // ADD THESE NEW STATUSES
      PICKED_UP: {
        color: "text-indigo-600",
        bg: "bg-indigo-50 border-indigo-200",
        icon: <Truck className="w-5 h-5" />,
        label: "Picked Up",
      },
      READY_FOR_PICKUP: {
        color: "text-orange-600",
        bg: "bg-orange-50 border-orange-200",
        icon: <Package className="w-5 h-5" />,
        label: "Ready for Pickup",
      },
    };
    return (
      statusMap[status] || {
        color: "text-gray-600",
        bg: "bg-gray-50",
        icon: null,
        label: status.replace(/_/g, " "),
      }
    );
  };
  const getProgressPercentage = (status: string) => {
    const progressMap: Record<string, number> = {
      PENDING: 10,
      PREPARING: 30,
      READY_FOR_PICKUP: 50, // Add this
      PICKED_UP: 60, // Add this
      ARRIVED_AT_CUSTOMER: 70,
      OUT_FOR_DELIVERY: 90,
      DELIVERED: 100,
      CANCELLED: 0,
    };
    return progressMap[status] || 0;
  };

  // Get count for each status
  const getStatusCount = (status: string) => {
    return orders.filter((order) => order.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 pt-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Loading Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48 mb-6 animate-pulse"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-48"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-32"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 pt-6">
        {/* Empty state remains the same */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 pt-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-emerald-700 bg-clip-text text-transparent mb-2">
                Order Dashboard
              </h1>
              <p className="text-lg text-slate-600">
                Manage and track all your food orders
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-2xl w-full md:w-64 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              <button className="p-3 bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-2xl hover:border-emerald-500 transition-colors">
                <Bell className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={() => setShowClearConfirmation(true)}
                className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Clear History
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold mb-2">{orders.length}</div>
              <div className="text-sm opacity-90">Total Orders</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold mb-2">
                {getStatusCount("DELIVERED")}
              </div>
              <div className="text-sm opacity-90">Completed</div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold mb-2">
                {getStatusCount("PREPARING") +
                  getStatusCount("OUT_FOR_DELIVERY")}
              </div>
              <div className="text-sm opacity-90">Active</div>
            </div>
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-3xl font-bold mb-2">
                ₹
                {orders.reduce(
                  (sum, order) => sum + (order.payment?.amount || 0),
                  0,
                )}
              </div>
              <div className="text-sm opacity-90">Total Spent</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs - Fixed with proper mapping */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              selectedFilter === "all"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white border-2 border-slate-200"
            }`}
          >
            All Orders ({orders.length})
          </button>
          {[
            { label: "Active", status: "PREPARING" },
            { label: "On the Way", status: "OUT_FOR_DELIVERY" },
            { label: "Arrived", status: "ARRIVED_AT_CUSTOMER" },
            { label: "Completed", status: "DELIVERED" },
            { label: "Cancelled", status: "CANCELLED" },
          ].map(({ label, status }) => (
            <button
              key={status}
              onClick={() => setSelectedFilter(label)}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                selectedFilter === label
                  ? getStatusInfo(status).bg +
                    " " +
                    getStatusInfo(status).color +
                    " border-2 shadow-lg"
                  : "bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white border-2 border-slate-200"
              }`}
            >
              {label} ({getStatusCount(status)})
            </button>
          ))}
        </div>

        {/* Batch Selection UI */}
        {selectedOrders.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">
                  {selectedOrders.length} orders selected
                </h4>
                <p className="text-sm text-slate-600">
                  Actions will apply to all selected orders
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrders([])}
                className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors"
              >
                Deselect All
              </button>
              <button
                onClick={() => setShowClearConfirmation(true)}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Clear Selected
              </button>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const progress = getProgressPercentage(order.status);

            // SIMPLE OTP LOGIC: Show OTP if it exists and order is not completed
            const shouldShowOTP =
              order.verification?.deliveryOTP &&
              order.status !== "DELIVERED" &&
              order.status !== "CANCELLED";

            // Debug: Add this to see what's happening
            console.log(
              `Order ${order._id} - Status: ${order.status}, Has OTP: ${!!order.verification?.deliveryOTP}, OTP value: ${order.verification?.deliveryOTP}, Should show: ${shouldShowOTP}`,
            );
            console.log("Verification object:", order.verification);

            return (
              <div
                key={order._id}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-100 hover:border-emerald-300 transition-all duration-500 hover:shadow-2xl"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      {/* Checkbox for selection */}
                      <label className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders([...selectedOrders, order._id]);
                            } else {
                              setSelectedOrders(
                                selectedOrders.filter((id) => id !== order._id),
                              );
                            }
                          }}
                          className="w-5 h-5 rounded border-2 border-slate-300 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                        />
                      </label>
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-gradient-to-br from-slate-100 to-emerald-100 rounded-2xl">
                            <Receipt className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )
                                : "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${statusInfo.bg} ${statusInfo.color} border`}
                      >
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          ₹{order.payment?.amount || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>Order Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  {/* Items Preview */}
                  <div className="mb-6">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-emerald-600" />
                      Order Items ({order.food.length})
                    </h4>
                    <div className="space-y-3">
                      {order.food.slice(0, 2).map((item, index) => {
                        const food = item.foodId as any;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center overflow-hidden">
                              {food?.imageUrl ? (
                                <img
                                  src={food.imageUrl}
                                  alt={food?.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23d1fae5'/%3E%3Ctext x='50%25' y='50%25' font-size='36' text-anchor='middle' dy='.3em' fill='%2310b981'%3E🍽️%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              ) : (
                                <div className="text-2xl">🍽️</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-slate-900 line-clamp-1">
                                {food?.title || "Food Item"}
                              </h5>
                              <p className="text-sm text-slate-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-700">
                                ₹
                                {((food?.price || 0) * item.quantity).toFixed(
                                  0,
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {order.food.length > 2 && (
                        <div className="text-center py-2">
                          <span className="text-sm text-emerald-600 font-semibold">
                            +{order.food.length - 2} more items
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment & Delivery Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">
                          Payment
                        </span>
                      </div>
                      <div className="text-sm text-slate-700">
                        {order.payment?.method || "Cash on Delivery"}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {order.payment?.transactionId || "No transaction ID"}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Navigation className="w-5 h-5 text-amber-600" />
                        <span className="font-semibold text-slate-900">
                          Delivery
                        </span>
                      </div>
                      <div className="text-sm text-slate-700">25-30 mins</div>
                      <div className="text-xs text-slate-500">
                        To your location
                      </div>
                    </div>
                  </div>

                  {/* OTP Section - FIXED */}
                  {shouldShowOTP && (
                    <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
                      {/* ... existing code ... */}
                      <div className="text-center">
                        <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
                          <div className="text-sm text-slate-500 mb-2">
                            Your OTP Code
                          </div>
                          <div className="text-4xl font-bold tracking-[0.3em] text-emerald-700 mb-2 px-4">
                            {(() => {
                              const otp = order.verification?.deliveryOTP;
                              if (!otp) return "----";
                              return otp.toString().padStart(4, "0");
                            })()}
                          </div>
                          <div className="text-xs text-slate-400">
                            Share only with verified delivery agent
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Footer */}
                <div className="p-6 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        window.open(`/track-order/${order._id}`, "_blank")
                      }
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() =>
                        window.open(`/order-details/${order._id}`, "_blank")
                      }
                      className="flex-1 px-4 py-3 bg-white text-slate-900 font-bold rounded-xl border-2 border-slate-200 hover:border-emerald-500 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `tel:+919999999999`)
                      }
                      className="p-3 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-500 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-slate-700" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show message when no orders match filter */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-slate-100 mb-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center">
              <Filter className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              No Orders Found
            </h3>
            <p className="text-slate-600 mb-8">
              No orders match the selected filter "{selectedFilter}". Try a
              different filter.
            </p>
            <button
              onClick={() => setSelectedFilter("all")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Show All Orders
            </button>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-slate-100 mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            Order Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {orders.length}
              </div>
              <div className="text-sm text-slate-600">Total Orders</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {orders.length > 0
                  ? Math.round(
                      (orders.filter((o) => o.status === "DELIVERED").length /
                        orders.length) *
                        100,
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-slate-600">Success Rate</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                ₹
                {orders.length > 0
                  ? Math.round(
                      orders.reduce(
                        (sum, order) => sum + (order.payment?.amount || 0),
                        0,
                      ) / orders.length,
                    )
                  : 0}
              </div>
              <div className="text-sm text-slate-600">Average Order Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear History Confirmation Modal */}
      {showClearConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Clear Order History
              </h3>
              <p className="text-slate-600 mb-6">
                {selectedOrders.length > 0
                  ? `Are you sure you want to clear ${selectedOrders.length} selected orders?`
                  : "This will clear all completed (delivered/cancelled) orders from view. Orders will reappear on page refresh."}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirmation(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
