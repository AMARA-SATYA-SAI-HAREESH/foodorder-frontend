import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Order } from "../types";
import { Truck, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/order/getAllOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Orders fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 text-center">
        <div className="w-32 h-32 bg-white/50 rounded-3xl flex items-center justify-center mb-8 shadow-xl">
          <Truck className="w-20 h-20 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No orders yet</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Your orders will appear here once you place them from the cart.
        </p>
        <a
          href="/cart"
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
        >
          Go to Cart
        </a>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING":
        return "bg-orange-100 text-orange-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Your Orders
          </h1>
          <p className="text-xl text-gray-600">
            Track all your food orders in one place
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50"
            >
              {/* Header */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h2>
                    {/* <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p> */}
                    <p className="text-sm text-gray-500">
                      Placed on{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>Est. delivery: 25-30 mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>Delivered to you</span>
                  </div>
                </div>
              </div>

              {/* Items
              <div className="p-8">
                <h3 className="font-bold text-lg mb-6 text-gray-800">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.food.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                    >
                      <img
                        src={
                          item.foodId.imageUrl ||
                          "https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=🍔"
                        }
                        alt={item.foodId.title}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">
                          {item.foodId.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                          ₹{item.foodId.price} x {item.quantity}
                        </p>
                        {item.foodId.foodTags?.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full mr-2 mb-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-orange-600">
                          ₹{(item.foodId.price * item.quantity).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Items */}
              <div className="p-8">
                <h3 className="font-bold text-lg mb-6 text-gray-800">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.food.map((item, index) => {
                    // ✅ Safe type handling
                    const food = item.foodId as any;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                      >
                        <img
                          src={
                            food?.imageUrl ||
                            "https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=🍔"
                          }
                          alt={food?.title || "Food item"}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">
                            {food?.title || "Unknown Food"}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                            ₹{food?.price || 0} x {item.quantity}
                          </p>
                          {/* Safe tags */}
                          {food?.foodTags
                            ?.slice(0, 2)
                            .map((tag: string, i: number) => (
                              <span
                                key={i}
                                className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full mr-2 mb-1"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-orange-600">
                            ₹{((food?.price || 0) * item.quantity).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 bg-gradient-to-r from-gray-50 to-orange-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-orange-600">
                    ₹{order.payment.amount}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span>Paid via</span>
                  <span className="font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                    {order.payment.method}
                  </span>
                  <span>· {order.payment.transactionId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
