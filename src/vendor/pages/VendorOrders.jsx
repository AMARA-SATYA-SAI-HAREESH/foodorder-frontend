// src/vendor/pages/VendorOrders.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  CheckSquare,
  RefreshCw,
  QrCode,
} from "lucide-react";
import {
  getVendorOrders,
  updateOrderStatus,
  acceptRejectOrder,
  getOrderStats,
} from "../api/vendorApi";
import QRVerificationModal from "../components/QRVerificationModal";
const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // ✅ NEW STATE FOR QR MODAL
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
      };
      const response = await getVendorOrders(params);
      if (response.data.status) {
        console.log("📦 Orders from API:", response.data.orders);
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getOrderStats();
      if (response.data.status) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

const handleStatusUpdate = async (orderId, newStatus) => {
  try {
    console.log("🔵 [VENDOR] Updating order status:", {
      orderId,
      newStatus,
      timestamp: new Date().toISOString(),
    });

    // ⭐⭐ FIX: Send "READY" instead of "READY_FOR_PICKUP" to backend
    const statusToSend = newStatus === "READY_FOR_PICKUP" ? "READY" : newStatus;
    
    console.log("🔄 [VENDOR] Sending to backend:", statusToSend);

    const response = await updateOrderStatus({
      orderId,
      status: statusToSend, // ⭐ Send "READY" for READY_FOR_PICKUP
    });

    console.log("✅ [VENDOR] Status update response:", {
      success: response.data?.status,
      data: response.data,
      order: response.data?.order,
      verification: response.data?.verification,
    });

    // ⭐⭐ FIX: Check for READY status (not READY_FOR_PICKUP)
    if (statusToSend === "READY") {
      console.log(
        "🟡 [VENDOR] Opening QR modal for READY order:",
        orderId,
        "with verification:",
        response.data?.verification
      );
      
      // Use the updated order from API response (has verification codes)
      if (response.data?.order) {
        setSelectedOrder(response.data.order);
        setShowQRModal(true);
        
        // Also update the order in local state with verification codes
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId 
              ? { ...order, ...response.data.order, verification: response.data.order.verification }
              : order
          )
        );
      } else {
        // Fallback to local order
        const order = orders.find((o) => o._id === orderId);
        if (order) {
          setSelectedOrder(order);
          setShowQRModal(true);
        }
      }
    }

    // Update local state with status change
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId 
          ? { 
              ...order, 
              status: newStatus, // Keep frontend status as READY_FOR_PICKUP
              ...(response.data?.order || {}) // Merge any other updates
            } 
          : order
      )
    );
    
    // If response has verification codes, log them for debugging
    if (response.data?.verification) {
      console.log("🔑 [VENDOR] Verification codes received:", {
        pickupCode: response.data.verification.pickupCode,
        deliveryOTP: response.data.verification.deliveryOTP,
        qrGeneratedAt: response.data.verification.qrGeneratedAt
      });
    }

  } catch (error) {
    console.error("❌ [VENDOR] Error updating status:", {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    
    let errorMessage = "Failed to update order status";
    if (error.response?.data?.message) {
      errorMessage += `: ${error.response.data.message}`;
    }
    alert(errorMessage);
  }
};
  const handleAcceptReject = async (orderId, action) => {
    try {
      await acceptRejectOrder({ orderId, action });
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      alert(`Failed to ${action} order`);
    }
  };
  // ✅ NEW: Handle QR button click
  const handleQRClick = (order) => {
    setSelectedOrder(order);
    setShowQRModal(true);
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "PREPARING":
        return <Package className="w-4 h-4 text-orange-500" />;
      case "READY_FOR_PICKUP": // ✅ ADDED
        return <QrCode className="w-4 h-4 text-green-500" />;
      case "ACCEPTED": // ✅ ADDED
        return <Truck className="w-4 h-4 text-purple-500" />;
      case "PICKED_UP": // ✅ ADDED
        return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      case "OUT_FOR_DELIVERY":
        return <Truck className="w-4 h-4 text-purple-500" />;
      case "DELIVERED":
        return <CheckSquare className="w-4 h-4 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-orange-100 text-orange-800";
      case "READY_FOR_PICKUP": // ✅ ADDED
        return "bg-green-100 text-green-800";
      case "ACCEPTED": // ✅ ADDED
        return "bg-purple-100 text-purple-800";
      case "PICKED_UP": // ✅ ADDED
        return "bg-indigo-100 text-indigo-800";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // ✅ NEW: Check if order can show QR
const canShowQR = (order) => {
  console.log("🔍 QR Check for order:", {
    id: order._id,
    status: order.status,
    verification: order.verification,
    hasPickupCode: !!order.verification?.pickupCode,
    hasDeliveryOTP: !!order.verification?.deliveryOTP,
    validStatus: ["READY_FOR_PICKUP", "ACCEPTED", "PICKED_UP"].includes(order.status)
  });
  
  const hasValidStatus = ["READY_FOR_PICKUP", "ACCEPTED", "PICKED_UP"].includes(order.status);
  const hasVerification = order.verification?.pickupCode && order.verification?.deliveryOTP;
  
  return hasValidStatus && hasVerification;
};
  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Modal */}
      {selectedOrder && (
        <QRVerificationModal
          order={selectedOrder}
          isOpen={showQRModal}
          onClose={() => {
            setShowQRModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
      {/* // Replace the QR Modal section (around line 154) with: */}
      {/* QR Modal */}
      {/* {showQRModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Verification</h3>
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="text-center">
              <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">Order ID:</p>
                <p className="font-mono font-bold">
                  #{selectedOrder._id.slice(-8)}
                </p>
              </div>
              <p className="text-gray-700 mb-4">
                QR verification will be implemented soon.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowQRModal(false);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.statusCounts?.map((stat) => (
            <div
              key={stat._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(stat._id)}
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.count}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {stat._id.replace(/_/g, " ").toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-4">
            <Filter className="text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY_FOR_PICKUP">Ready for Pickup</option>{" "}
              {/* ✅ ADDED */}
              <option value="ACCEPTED">Accepted by Driver</option>{" "}
              {/* ✅ ADDED */}
              <option value="PICKED_UP">Picked Up</option> {/* ✅ ADDED */}
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      {/* Orders Table */}
      {/* Orders Table - Responsive */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Mobile View (Cards) */}
        <div className="md:hidden">
          {filteredOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order._id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        #{order._id.slice(-6)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-600">Customer:</span>{" "}
                      <span className="font-medium">
                        {order.buyer?.userName || "Customer"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Amount:</span>{" "}
                      <span className="font-medium">
                        ₹{order.payment?.amount || 0}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Items:</span>{" "}
                      <span className="font-medium">
                        {order.food?.length || 0} items
                      </span>
                    </div>
                  </div>

                  {/* Actions - Mobile */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            handleAcceptReject(order._id, "accept")
                          }
                          className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleAcceptReject(order._id, "reject")
                          }
                          className="flex-1 px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {order.status === "CONFIRMED" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(order._id, "PREPARING")
                        }
                        className="flex-1 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === "PREPARING" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(order._id, "READY")
                        }
                        className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200"
                      >
                        Ready for Pickup
                      </button>
                    )}
                    {console.log(
                      "Order status:",
                      order.status,
                      "Can show QR:",
                      canShowQR(order)
                    )}
                    {/* ✅ QR Button for Mobile */}
                    {canShowQR(order) && (
                      <button
                        onClick={() => handleQRClick(order)}
                        className="flex-1 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs rounded-lg hover:bg-purple-200 flex items-center justify-center gap-1"
                      >
                        <QrCode className="w-3 h-3" />
                        QR Code
                      </button>
                    )}

                    <button className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try changing your search or filter"
                  : "No orders placed yet"}
              </p>
            </div>
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-6)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.buyer?.userName || "Customer"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.buyer?.phone || "No phone"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.food?.length || 0} items
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.food?.[0]?.foodId?.title || "Items"}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ₹{order.payment?.amount || 0}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {order.payment?.method?.toLowerCase() || "COD"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {order.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                handleAcceptReject(order._id, "accept")
                              }
                              className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleAcceptReject(order._id, "reject")
                              }
                              className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {order.status === "CONFIRMED" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "PREPARING")
                            }
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200"
                          >
                            Start Preparing
                          </button>
                        )}

                        {order.status === "PREPARING" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "READY")
                            }
                            className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200"
                          >
                            Ready for Pickup
                          </button>
                        )}
                        {/* In VendorOrders.jsx - Update the status buttons section */}

                        {order.status === "PICKED_UP" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "OUT_FOR_DELIVERY")
                            }
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-lg hover:bg-indigo-200"
                          >
                            Mark as Out for Delivery
                          </button>
                        )}

                        {order.status === "OUT_FOR_DELIVERY" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "DELIVERED")
                            }
                            className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200"
                          >
                            Mark as Delivered
                          </button>
                        )}
                        {console.log(
                          "Desktop - Order status:",
                          order.status,
                          "Can show QR:",
                          canShowQR(order)
                        )}
                        {/* ✅ QR Button for Desktop */}
                        {canShowQR(order) && (
                          <button
                            onClick={() => {
                              console.log("Order for QR:", order);
                              handleQRClick(order);
                            }}
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg hover:bg-purple-200 flex items-center gap-1"
                            title="Show QR Code"
                          >
                            <QrCode className="w-3 h-3" />
                            QR
                          </button>
                        )}

                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No orders found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || statusFilter !== "all"
                        ? "Try changing your search or filter"
                        : "No orders placed yet"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Status Flow Guide */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Order Status Flow
        </h3>
        <div className="flex items-center justify-between">
          {[
            {
              status: "PENDING",
              label: "Order Placed",
              action: "Accept/Reject",
            },
            {
              status: "CONFIRMED",
              label: "Confirmed",
              action: "Start Preparing",
            },
            {
              status: "PREPARING",
              label: "Preparing",
              action: "Ready for Delivery",
            },
            {
              status: "OUT_FOR_DELIVERY",
              label: "Out for Delivery",
              action: "Driver Assigned",
            },
            { status: "DELIVERED", label: "Delivered", action: "Completed" },
          ].map((step, index) => (
            <div key={step.status} className="text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  index === 0
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <p className="text-xs font-medium text-gray-900">{step.label}</p>
              <p className="text-xs text-gray-500">{step.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;
