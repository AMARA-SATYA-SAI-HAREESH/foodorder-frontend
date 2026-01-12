import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Lock,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, clearCart, createOrder } =
    useCart();
  const { user, token } = useAuth();

  const handleCheckout = async () => {
    if (!token) {
      alert("Please login to place an order.");
      return;
    }
    const order = await createOrder();
    if (order) {
      alert("Order placed successfully!");
    } else {
      alert("Failed to create order. Check backend logs.");
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        {/* Mobile Header */}
        <div className="md:hidden w-full fixed top-0 left-0 bg-white border-b border-gray-200 px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-700">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>

        <div className="text-center mt-16 md:mt-0">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4 mx-auto">
            <ShoppingBag className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            Add delicious foods from restaurants to start your order
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium text-sm hover:shadow-lg transition-shadow"
          >
            Browse Restaurants
          </Link>
          <div className="mt-6">
            <Link
              to="/orders"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View Previous Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-40">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 md:pt-0">
        {/* Desktop Layout - NO CHANGES */}
        <div className="hidden md:block min-h-[70vh] bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 py-8 px-4">
          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="w-7 h-7 text-orange-500" />
                Your Cart
              </h1>
              <button
                onClick={clearCart}
                className="text-xs md:text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear cart
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Items */}
              <div className="md:col-span-2 space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {state.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-orange-50 flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-1">
                            {item.title}
                          </h2>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            ₹{item.price} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        {/* Quantity controls */}
                        <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-sm font-semibold text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500">Subtotal</p>
                          <p className="text-sm md:text-base font-semibold text-orange-600">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 md:p-5 border border-gray-100 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Order Summary
                  </h2>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium text-gray-800">
                      {state.totalItems}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">
                      ₹{state.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-dashed border-gray-300 my-2" />
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      Total
                    </span>
                    <span className="text-xl font-bold text-orange-600">
                      ₹{state.totalAmount}
                    </span>
                  </div>

                  {!token && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>Login required to place order.</span>
                    </div>
                  )}
                </div>

                <Link
                  to="/checkout"
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - NEW CHANGES */}
        <div className="md:hidden bg-white min-h-screen">
          {/* Cart Items List */}
          <div className="p-4 space-y-3">
            {state.items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl p-3"
              >
                <div className="flex gap-3">
                  {/* Square Image */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-orange-50 overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ₹{item.price} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-orange-600">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card - Mobile */}
          <div className="bg-white border-t border-gray-200 mt-4">
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Items ({state.totalItems})
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{state.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-orange-600">
                    ₹{state.totalAmount}
                  </span>
                </div>
              </div>

              {!token && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-yellow-800">
                    <Lock className="w-4 h-4" />
                    <span>Login required to place order</span>
                  </div>
                </div>
              )}

              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 px-6 rounded-xl font-bold text-center text-sm hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                PROCEED TO CHECKOUT
              </Link>
              <Link
                to="/orders"
                className="block text-center mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                View Previous Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
