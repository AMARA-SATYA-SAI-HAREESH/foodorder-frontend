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
} from "lucide-react";

const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, clearCart, createOrder } =
    useCart();
  //const { auth } = useAuth();
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 px-4">
        <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-4">
          <ShoppingBag className="w-12 h-12 text-orange-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 text-sm md:text-base mb-4 text-center max-w-md">
          Add some delicious foods from the home page to start your order.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <a
            href="/orders"
            className="w-full text-center block text-orange-500 hover:text-orange-600 font-medium text-sm py-2 px-4 border border-orange-200 rounded-xl hover:bg-orange-50 transition-all"
          >
            👆 View Previous Orders
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 py-8 px-4">
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

            {/* <button
              onClick={handleCheckout}
              disabled={state.loading || !token}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
            
              {state.loading ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button> */}
            <Link
              to="/checkout"
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              Proceed to Checkout
            </Link>

            {/* 🔥 NEW LINK - ADD THIS */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
