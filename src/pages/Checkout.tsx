import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Truck, MapPin, CreditCard, Home } from "lucide-react";

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

      const order = await createOrder(); // Or direct API call
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
    <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Address Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-orange-500" />
              Delivery Address
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="House no, street, landmark..."
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500"
                    placeholder="Visakhapatnam"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500"
                    placeholder="91XXXXXXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentMethod: e.target.value as any,
                    })
                  }
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="UPI">UPI (GPay/PhonePe)</option>
                  <option value="CARD">Credit/Debit Card</option>
                </select>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-8">
              {state.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 space-y-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{state.totalAmount.toFixed(0)}</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : `Place Order • ₹${state.totalAmount.toFixed(0)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
