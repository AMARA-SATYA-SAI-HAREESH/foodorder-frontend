import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Clock,
  MapPin,
  Flame,
  ChevronRight,
  Share2,
  Heart,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">
            Loading food details...
          </p>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-6 rounded-xl border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Food not found
          </h2>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-orange-500 hover:text-red-500 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-gray-700 hover:text-orange-500 p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-sm font-bold text-gray-900 line-clamp-1">
              Food Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-1.5">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Food Image */}
      <div className="relative">
        <img
          src={
            food.imageUrl ||
            "https://images.unsplash.com/photo-500x400/biryani.jpg"
          }
          alt={food.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {food.foodTags &&
            food.foodTags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* Food Details */}
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {food.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{food.rating || 4.2}</span>
                <span className="text-gray-500">({food.rating || "50+"})</span>
              </div>
              <span>•</span>
              <span>{food.categoryId || "Main Course"}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ₹{food.price}
            </div>
            <div className="text-xs text-gray-500 line-through">
              ₹{Math.round(food.price * 1.2)}
            </div>
            <div className="text-xs text-green-600 font-bold">20% OFF</div>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {food.description}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Quantity</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              -
            </button>
            <span className="text-lg font-bold w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Restaurant Info - Square Card */}
        {restaurant && (
          <Link
            to={`/restaurant/${restaurant._id}`}
            className="block bg-white border border-gray-200 rounded-xl p-3 mb-4 hover:border-orange-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-100 to-orange-50 overflow-hidden flex-shrink-0">
                <img
                  src={
                    restaurant.logoUrl ||
                    "https://via.placeholder.com/56x56/FF6B35/FFFFFF?text=🍔"
                  }
                  alt={restaurant.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                    {restaurant.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{restaurant.rating || 4.2}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{restaurant.time || "25-30 min"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">
                    {restaurant.coords?.address?.split(",")[0] || "Nearby"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Related Foods - Square Cards Grid */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            You might also like
          </h2>
          <Link
            to="/"
            className="text-sm text-orange-500 font-medium flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Sample Related Food Cards */}
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden aspect-square flex flex-col"
            >
              <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-100 to-orange-50">
                <img
                  src="https://via.placeholder.com/200x200/FF6B35/FFFFFF?text=Food"
                  alt="Related food"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                  Similar Dish
                </h4>
                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-gray-900">₹220</div>
                  <button className="text-xs bg-orange-500 text-white px-2.5 py-1 rounded-lg font-bold">
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-xl font-bold text-gray-900">
              ₹{food.price * quantity}
            </div>
          </div>
          <button
            onClick={() => addToCart({ ...food, quantity } as CartItem)}
            className="flex-1 ml-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-bold text-sm hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Spacing for fixed bottom bar */}
      <div className="h-20"></div>
    </div>
  );
};

export default FoodDetailPage;
