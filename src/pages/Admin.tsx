import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Food, Order } from "../types";
import {
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  Trash2,
  Loader2,
  Package,
  ShoppingBag,
} from "lucide-react";

const Admin: React.FC = () => {
  // const { auth } = useAuth();
  const { user, token } = useAuth();
  const [foods, setFoods] = useState<Food[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [newFood, setNewFood] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    restaurantId: "",
  });

  // const isAdmin = auth.user?.userType === "admin";
  const isAdmin = user?.userType === "admin";

  useEffect(() => {
    // if (!isAdmin || !auth.token) {
    if (!isAdmin || !token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [foodsRes, ordersRes] = await Promise.all([
          api.get("/api/food/getAllFoods"),
          api.get("/api/order/getAllOrders"),
        ]);
        setFoods(foodsRes.data.foods || []);
        setOrders(ordersRes.data.orders || []);
      } catch (error) {
        console.error("Admin fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, token]);

  const handleCreateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      setCreating(true);
      const payload = {
        ...newFood,
        price: Number(newFood.price),
        isAvailable: true,
        foodTags: [],
        code: "",
        rating: 5,
      };

      const res = await api.post("/api/food/create-food", payload);
      if (res.data?.food) {
        setFoods((prev) => [res.data.food, ...prev]);
        setNewFood({
          title: "",
          description: "",
          price: "",
          imageUrl: "",
          categoryId: "",
          restaurantId: "",
        });
      }
    } catch (error) {
      console.error("Create food error:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this food item?")) return;

    try {
      await api.delete(`/api/food/delete-food?id=${id}`);
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error("Delete food error:", error);
    }
  };

  if (!token || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
        <ShieldCheck className="w-16 h-16 text-orange-400 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Admin Access Required</h1>
        <p className="text-gray-300 max-w-md text-center">
          You must be logged in as an admin user to view this page. Please login
          with an admin account.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-orange-500" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage foods and view orders from your FoodOrder backend.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm flex items-center gap-2 shadow-lg">
            <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold">
              {user?.userName[0].toUpperCase()}
            </span>
            <div className="text-left">
              <p className="font-semibold">{user?.userName}</p>
              <p className="text-xs text-slate-300">Admin</p>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Create Food */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <PlusCircle className="w-5 h-5 text-orange-500" />
              Add New Food
            </h2>
            <form className="space-y-3" onSubmit={handleCreateFood}>
              <input
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                placeholder="Title"
                value={newFood.title}
                onChange={(e) =>
                  setNewFood((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              <textarea
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                placeholder="Description"
                rows={3}
                value={newFood.description}
                onChange={(e) =>
                  setNewFood((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
              <input
                type="number"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                placeholder="Price (₹)"
                value={newFood.price}
                onChange={(e) =>
                  setNewFood((prev) => ({ ...prev, price: e.target.value }))
                }
                required
              />
              <input
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                placeholder="Image URL"
                value={newFood.imageUrl}
                onChange={(e) =>
                  setNewFood((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
              />
              <input
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                placeholder="Category ID (Mongo _id)"
                value={newFood.categoryId}
                onChange={(e) =>
                  setNewFood((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
                required
              />
              <input
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                placeholder="Restaurant ID (Mongo _id)"
                value={newFood.restaurantId}
                onChange={(e) =>
                  setNewFood((prev) => ({
                    ...prev,
                    restaurantId: e.target.value,
                  }))
                }
                required
              />

              <button
                type="submit"
                disabled={creating}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{creating ? "Creating..." : "Create Food Item"}</span>
              </button>
            </form>

            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
              <AlertTriangle className="w-4 h-4" />
              <p>
                Category ID & Restaurant ID must be valid MongoDB ObjectIds from
                your backend collections.
              </p>
            </div>
          </div>

          {/* Foods list */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              Foods ({foods.length})
            </h2>
            {foods.length === 0 ? (
              <p className="text-sm text-slate-500">
                No foods yet. Create one on the left.
              </p>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                {foods.map((food) => (
                  <div
                    key={food._id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                        {food.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        ₹{food.price} •{" "}
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteFood(food._id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Orders summary */}
            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-orange-500" />
                Orders ({orders.length})
              </h2>
              {orders.length === 0 ? (
                <p className="text-sm text-slate-500">No orders yet.</p>
              ) : (
                <p className="text-xs text-slate-500">
                  Orders list UI can be added here (status, buyer, amount). Data
                  already loaded from <code>/api/order/getAllOrders</code>.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
