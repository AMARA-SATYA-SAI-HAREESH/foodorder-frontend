import React from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Package,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const OrderCard = ({ order, type = "available", onAction }) => {
  const getStatusConfig = (status) => {
    const configs = {
      READY_FOR_PICKUP: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4" />,
        actionLabel: "Accept Order",
      },
      ACCEPTED: {
        color: "bg-blue-100 text-blue-800",
        icon: <Package className="w-4 h-4" />,
        actionLabel: "Pick Up",
      },
      PICKED_UP: {
        color: "bg-purple-100 text-purple-800",
        icon: <Navigation className="w-4 h-4" />,
        actionLabel: "Start Delivery",
      },
      ON_THE_WAY: {
        color: "bg-indigo-100 text-indigo-800",
        icon: <Navigation className="w-4 h-4" />,
        actionLabel: "Mark Delivered",
      },
      DELIVERED: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
        actionLabel: "View Details",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="w-4 h-4" />,
        actionLabel: "View Details",
      },
    };

    return (
      configs[status] || {
        color: "bg-gray-100 text-gray-800",
        icon: <AlertCircle className="w-4 h-4" />,
        actionLabel: "View Details",
      }
    );
  };

  const config = getStatusConfig(order.status);
  const timeAgo = getTimeAgo(order.createdAt);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">
                Order #{order._id?.slice(-8)}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
              >
                {config.icon}
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              ₹{order.totalAmount || 0}
            </p>
            <p className="text-sm text-gray-500">Including delivery</p>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-1">
            {order.restaurantId?.name}
          </h4>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{order.restaurantId?.address}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-1">
            Delivery to {order.buyer?.userName}
          </h4>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{order.deliveryAddress}</span>
          </div>
        </div>

        {/* Items Summary */}
        {order.items && order.items.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Items ({order.items.length})
            </h4>
            <div className="space-y-1">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity} × {item.foodId?.name || "Item"}
                  </span>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-sm text-gray-500">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {type === "available" && order.status === "READY_FOR_PICKUP" && (
            <button
              onClick={() => onAction?.("accept", order._id)}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Accept Order
            </button>
          )}

          {type === "current" && (
            <>
              {order.status === "ACCEPTED" && (
                <button
                  onClick={() => onAction?.("pickup", order._id)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  Pick Up Order
                </button>
              )}
              {order.status === "PICKED_UP" && (
                <button
                  onClick={() => onAction?.("deliver", order._id)}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Start Delivery
                </button>
              )}
              {order.status === "ON_THE_WAY" && (
                <button
                  onClick={() => onAction?.("complete", order._id)}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                >
                  Mark Delivered
                </button>
              )}
            </>
          )}

          <button
            onClick={() => onAction?.("details", order._id)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Details
          </button>

          <button
            onClick={() => onAction?.("navigate", order._id)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Navigate
          </button>

          {(type === "available" || type === "current") &&
            order.status !== "DELIVERED" && (
              <button
                onClick={() => onAction?.("cancel", order._id)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50"
              >
                Cancel
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default OrderCard;
