import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Clock,
  MapPin,
  Flame,
} from "lucide-react";
import api from "../services/api";
import { Food, Restaurant, CartItem } from "../types";
import { useCart } from "../context/CartContext";

const FoodDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [food, setFood] = useState<Food | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchFood = async () => {
      try {
        // 1. Get food details
        const foodRes = await api.get(`/api/food/getFood?id=${id}`);
        setFood(foodRes.data.food);

        // 2. Get restaurant details
        if (foodRes.data.food?.restaurantId) {
          const restRes = await api.get(
            `/restaurant/getRestaurant?id=${foodRes.data.food.restaurantId}`
          );
          setRestaurant(restRes.data.restaurant);
        }
      } catch (error) {
        console.error("Food fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading food details...</p>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Food not found</h2>
          <Link to="/" className="text-orange-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-orange-500 mb-6 p-2 rounded-xl hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Food Image + Add to Cart */}
          <div className="space-y-6">
            <div className="relative group">
              <img
                src={
                  food.imageUrl ||
                  "https://images.unsplash.com/photo-500x400/biryani.jpg"
                }
                onError={(e) => console.log("Image fail:", food.imageUrl)}
                alt={food.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform"
              />
              {food.foodTags && food.foodTags.length > 0 && (
                <div className="absolute top-6 left-6 space-x-2">
                  {food.foodTags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold shadow-md backdrop-blur-sm"
                    >
                      <Flame className="w-3 h-3 text-orange-500 fill-current" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {food.title}
                </h1>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(food.rating || 4.2) ? "fill-current" : ""
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-bold text-lg">
                    {food.rating || 4.2}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-orange-600">
                    ₹{food.price}
                  </span>
                  <span className="text-sm text-gray-500 ml-4 line-through">
                    ₹{Math.round(food.price * 1.2)}
                  </span>
                  <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    20% OFF
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {food.description}
                </p>
              </div>

              {/* Quantity + Add */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                  >
                    -
                  </button>
                  <span className="w-16 text-center text-xl font-bold px-4">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                // onClick={() => addToCart({ ...food, quantity })}
                onClick={() => addToCart({ ...food, quantity } as CartItem)}
                className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500 text-white py-4 px-8 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart • ₹{food.price * quantity}
              </button>
            </div>
          </div>

          {/* Restaurant Info + Related */}
          <div className="space-y-8 lg:sticky lg:top-32 self-start">
            {/* Restaurant Info */}
            {restaurant && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={
                      restaurant.logoUrl ||
                      "https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=🍔"
                    }
                    alt={restaurant.title}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {restaurant.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <span>
                          {restaurant.rating} ({restaurant.ratingCount})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.coords?.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/restaurant/${restaurant._id}`}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-2xl text-center font-semibold hover:shadow-xl transition-all"
                  >
                    Full Menu
                  </Link>
                  <button className="px-6 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-all font-semibold">
                    Directions
                  </button>
                </div>
              </div>
            )}

            {/* Related Foods */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-gray-900">
                You might also like
              </h4>
              <div className="space-y-4">
                {/* Add 3-4 similar foods here */}
                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer group">
                  <img
                    src="https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=Similar"
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-lg group-hover:text-orange-600">
                      Similar Dish
                    </h5>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      Description
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-orange-600 font-bold text-lg">
                        ₹220
                      </span>
                      <div className="flex text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4" />
                        <Star className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;
