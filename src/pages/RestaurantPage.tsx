import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  ShoppingCart,
  Filter,
  ChevronRight,
} from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-6 rounded-xl border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Restaurant not found
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
              {restaurant.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">
                  {restaurant.rating || 4.5}
                </span>
              </div>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">
                {restaurant.time || "25-30 min"}
              </span>
            </div>
          </div>
          <button className="p-1.5">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Restaurant Banner */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    restaurant.isOpen ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-sm font-medium">
                  {restaurant.isOpen ? "OPEN NOW" : "CLOSED"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">
                  {restaurant.coords?.address?.split(",")[0] || "Nearby"}
                </span>
              </div>
            </div>
            <div className="text-right text-white">
              <div className="text-lg font-bold">
                ₹{restaurant.deliveryPrice || 25}
              </div>
              <div className="text-xs">Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {foods.length}
            </div>
            <div className="text-xs text-gray-600">Items</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">₹199</div>
            <div className="text-xs text-gray-600">Min Order</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">25-30</div>
            <div className="text-xs text-gray-600">Minutes</div>
          </div>
        </div>
      </div>

      {/* Menu Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            <p className="text-xs text-gray-500">
              {foods.length} items available
            </p>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            <Filter className="w-3 h-3" />
            Filter
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
            All
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
            Recommended
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
            Popular
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
            Veg Only
          </button>
        </div>
      </div>

      {/* Menu Items - Square Cards Grid */}
      <div className="p-3">
        {foods.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No menu items
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This restaurant hasn't added items yet
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {foods.map((food) => (
              <div
                key={food._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors overflow-hidden aspect-square flex flex-col"
              >
                {/* Square Food Image */}
                <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-orange-50">
                  <img
                    src={food.imageUrl}
                    alt={food.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-0.5 bg-white/90 backdrop-blur-xs rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold">
                        {food.rating || 4.2}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Square Food Content */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="mb-2">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                      {food.title}
                    </h3>
                  </div>

                  <div className="flex-1 min-h-0">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {food.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-bold text-gray-900">
                        ₹{food.price}
                      </div>
                      <button
                        onClick={() => addToCart(food)}
                        className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:shadow-sm transition-shadow flex items-center gap-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Cart Summary */}
      {foods.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">
                Viewing {foods.length} items
              </div>
              <div className="text-xs text-gray-500">Add items to cart</div>
            </div>
            <Link
              to="/cart"
              className="flex items-center gap-2 text-sm text-orange-500 hover:text-red-500 font-medium"
            >
              View Cart <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Spacing for fixed bottom bar */}
      <div className="h-20"></div>
    </div>
  );
};

export default RestaurantPage;
