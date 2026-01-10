import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart } from "lucide-react";
import api from "../services/api";
import { Restaurant, Food } from "../types";
import { useCart } from "../context/CartContext";

const RestaurantPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      try {
        const restRes = await api.get(`/restaurant/getRestaurant?id=${id}`);
        console.log("Restaurant:", restRes.data);
        setRestaurant(restRes.data.restaurant);

        // ✅ Fixed param name
        const foodsRes = await api.get(
          `/api/food/getFoodsbyrestaurant?id=${id}`
        );
        console.log("Foods:", foodsRes.data);
        setFoods(foodsRes.data.foods || []);
      } catch (error) {
        console.error("Restaurant fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading restaurant menu...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Restaurant not found
          </h2>
          <Link to="/" className="text-orange-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-pink-50">
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-start gap-6">
          <Link
            to="/"
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{restaurant.title}</h1>
              <div className="flex items-center gap-4 text-lg mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 text-yellow-300 fill-current"
                      />
                    ))}
                  </div>
                  <span className="font-bold">{restaurant.rating || 4.5}</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  {restaurant.time || "25-30 min"}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 bg-white/20 p-3 rounded-xl mb-6">
                <MapPin className="w-5 h-5" />
                <span>{restaurant.coords?.address || "Near you"}</span>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">₹25</div>
                <div className="text-lg mb-4">Delivery</div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    restaurant.isOpen
                      ? "bg-green-100/50 text-green-800 border border-green-200"
                      : "bg-gray-100/50 text-gray-600 border border-gray-200"
                  }`}
                >
                  {restaurant.isOpen ? "OPEN NOW" : "CLOSED"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Foods */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Menu ({foods.length} items)</h2>

        {foods.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 p-6 bg-gray-100 rounded-3xl">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No menu items yet
            </h3>
            <p className="text-gray-600 mb-6">
              This restaurant hasn't added foods
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl hover:bg-orange-600"
            >
              ← Explore Other Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {foods.map((food) => (
              <div
                key={food._id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl p-6 border hover:border-orange-200 transition-all overflow-hidden"
              >
                <img
                  src={food.imageUrl}
                  alt={food.title}
                  className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform"
                />
                <div className="space-y-3">
                  <h3 className="font-bold text-xl line-clamp-2">
                    {food.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {food.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {food.rating || 4.2}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{food.price}
                      </span>
                      <button
                        onClick={() => addToCart(food)}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;
