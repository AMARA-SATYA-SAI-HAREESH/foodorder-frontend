// src/vendor/pages/VendorDashboard.jsx - UPDATED MOBILE FIX
import React, { useState, useEffect } from "react";
import {
  Package,
  Utensils,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useVendor } from "../context/VendorContext";
import {
  getRestaurantStats,
  getTodaysOrders,
  getOrderStats,
  getEarningsSummary,
} from "../api/vendorApi";
import { IMAGE_URLS } from "../utils/imageUrls";

const VendorDashboard = () => {
  const { vendor, restaurant } = useVendor();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [todaysOrders, setTodaysOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [earnings, setEarnings] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, orderStatsRes, earningsRes] =
        await Promise.all([
          getRestaurantStats(),
          getTodaysOrders(),
          getOrderStats(),
          getEarningsSummary(),
        ]);

      if (statsRes.data?.status) setStats(statsRes.data.stats);
      if (ordersRes.data?.status) setTodaysOrders(ordersRes.data.orders || []);
      if (orderStatsRes.data?.status) setOrderStats(orderStatsRes.data.stats);
      if (earningsRes.data?.status) setEarnings(earningsRes.data.earnings);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values on error
      setStats({ totalOrders: 0, totalFoods: 0, pendingOrders: 0 });
      setTodaysOrders([]);
      setOrderStats({ statusCounts: [], totalOrders: 0 });
      setEarnings({
        today: { totalAmount: 0, netEarnings: 0 },
        thisMonth: { netEarnings: 0 },
      });
    } finally {
      setLoading(false);
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
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Welcome, {vendor?.userName || "Vendor"}!
        </h1>
        <p className="text-gray-600 text-sm">
          Here's what's happening with your restaurant today.
        </p>
      </div>

      {/* Stats Cards - 2x2 on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-2">
        {/* Total Orders */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Orders</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalOrders || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                {todaysOrders?.length || 0} today
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Foods */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Menu Items</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalFoods || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {restaurant?.isVerified ? "Verified" : "Pending"}
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Utensils className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Pending Orders</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">
                {stats?.pendingOrders || 0}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                <Clock className="inline w-3 h-3 mr-1" />
                Needs attention
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">
                Today's Revenue
              </p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">
                ₹{earnings?.today?.totalAmount || 0}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                <DollarSign className="inline w-3 h-3 mr-1" />
                Net: ₹{earnings?.today?.netEarnings || 0}
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Stack on mobile */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-6 px-2">
        {/* Today's Orders */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Today's Orders
            </h2>
            <span className="text-xs md:text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-3">
            {todaysOrders?.length > 0 ? (
              todaysOrders.slice(0, 3).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      Order #{order._id?.slice(-6) || "N/A"}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                      {order.buyer?.userName || "Customer"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-medium text-gray-900 text-sm">
                      ₹{order.payment?.amount || 0}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PREPARING"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status || "PENDING"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No orders today</p>
              </div>
            )}
          </div>

          <button className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50">
            View All Orders
          </button>
        </div>

        {/* Order Status Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Order Status
          </h2>

          <div className="space-y-3">
            {orderStats?.statusCounts?.map((stat) => (
              <div key={stat._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      stat._id === "DELIVERED"
                        ? "bg-green-500"
                        : stat._id === "PREPARING"
                        ? "bg-blue-500"
                        : stat._id === "PENDING"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-700 truncate">
                    {stat._id?.charAt(0) + stat._id?.slice(1).toLowerCase() ||
                      "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">
                    {stat.count || 0}
                  </span>
                  <div className="w-16 md:w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((stat.count || 0) / (orderStats?.totalOrders || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100">
                Add Food
              </button>
              <button className="py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm hover:bg-green-100">
                Update Status
              </button>
              <button className="py-2 bg-purple-50 text-purple-700 rounded-lg font-medium text-sm hover:bg-purple-100">
                Earnings
              </button>
              <button className="py-2 bg-orange-50 text-orange-700 rounded-lg font-medium text-sm hover:bg-orange-100">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats - Stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 px-2">
        {/* Earnings Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Earnings Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Today</span>
              <span className="font-medium text-sm">
                ₹{earnings?.today?.netEarnings || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">This Week</span>
              <span className="font-medium text-sm">
                ₹{(earnings?.today?.netEarnings || 0) * 7}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">This Month</span>
              <span className="font-medium text-sm">
                ₹{earnings?.thisMonth?.netEarnings || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Restaurant Status */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Restaurant Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Verification</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  restaurant?.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {restaurant?.isVerified ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Status</span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    restaurant?.isOpen ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm">
                  {restaurant?.isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Rating</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      i < Math.floor(restaurant?.rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-xs text-gray-600">
                  ({restaurant?.ratingCount || 0})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Recent Activity
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-900">Order delivered</p>
                <p className="text-xs text-gray-500">10 min ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-900">New review</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-900">Payment received</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
