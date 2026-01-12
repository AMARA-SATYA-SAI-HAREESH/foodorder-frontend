import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Truck,
  MapPin,
  CreditCard,
  Home,
  Shield,
  CheckCircle,
  Package,
  Clock,
} from "lucide-react";

const Checkout: React.FC = () => {
  const { state, clearCart, createOrder } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
    paymentMethod: "UPI" as "UPI" | "COD" | "CARD",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        food: state.items.map((item) => ({
          foodId: item._id,
          quantity: item.quantity,
        })),
        payment: {
          method: formData.paymentMethod,
          amount: state.totalAmount,
          transactionId: `TXN_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        },
        address: formData.address,
        status: "PENDING",
      };

      const order = await createOrder();
      if (order) {
        navigate("/order-success", {
          state: { orderId: order._id, amount: state.totalAmount },
        });
      }
    } catch (error) {
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="text-sm font-semibold text-gray-900 ml-3">
                Cart
              </div>
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="text-sm font-semibold text-gray-900 ml-3">
                Details
              </div>
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 font-bold">3</span>
              </div>
              <div className="text-sm font-medium text-gray-500 ml-3">
                Payment
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">
                  Delivery Address
                </h2>
                <MapPin className="w-6 h-6 text-orange-500" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Complete Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Flat/House No, Floor, Building, Street, Area..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">
                  Payment Method
                </h2>
                <CreditCard className="w-6 h-6 text-orange-500" />
              </div>

              <div className="space-y-4">
                <div
                  className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === "UPI"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "UPI" })
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">UPI</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        UPI / Wallet
                      </div>
                      <div className="text-sm text-gray-500">
                        Google Pay, PhonePe, Paytm
                      </div>
                    </div>
                  </div>
                  {formData.paymentMethod === "UPI" && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                <div
                  className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === "COD"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "COD" })
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">₹</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-gray-500">
                        Pay when you receive
                      </div>
                    </div>
                  </div>
                  {formData.paymentMethod === "COD" && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                <div
                  className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === "CARD"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "CARD" })
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Credit / Debit Card
                      </div>
                      <div className="text-sm text-gray-500">
                        Visa, Mastercard, RuPay
                      </div>
                    </div>
                  </div>
                  {formData.paymentMethod === "CARD" && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-green-800">
                    Secure Payment
                  </div>
                  <div className="text-sm text-green-700">
                    Your payment information is encrypted and secure
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between pb-4 border-b border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-orange-50 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span>₹{state.totalAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST</span>
                  <span>₹{(state.totalAmount * 0.05).toFixed(0)}</span>
                </div>
                <div className="h-px bg-gray-200 my-3"></div>
                <div className="flex justify-between text-xl font-black text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{(state.totalAmount * 1.05).toFixed(0)}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div className="font-semibold text-orange-800">
                    Delivery Time
                  </div>
                </div>
                <div className="text-sm text-orange-700">
                  Estimated delivery: 25-35 minutes
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || state.items.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Place Order • ₹{(state.totalAmount * 1.05).toFixed(0)}
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center gap-6 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
