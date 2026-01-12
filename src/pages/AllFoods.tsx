import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  X,
} from "lucide-react";
import api from "../services/api";
import { Food, Restaurant } from "../types";
import { useCart } from "../context/CartContext";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  const [foods, setFoods] = useState<Food[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "foods" | "restaurants">(
    "all"
  );

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const [foodsRes, restaurantsRes] = await Promise.all([
          api.get(`/api/food/getAllFoods`),
          api.get("/restaurant/getAllRestaurants"),
        ]);

        const allFoods: Food[] = Array.isArray(foodsRes.data?.foods)
          ? foodsRes.data.foods
          : [];
        const allRestaurants: Restaurant[] = Array.isArray(
          restaurantsRes.data?.restaurants
        )
          ? restaurantsRes.data.restaurants
          : [];

        // Filter results based on search query
        const filteredFoods = allFoods.filter(
          (food: Food) =>
            food.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (food.description &&
              food.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        );

        const filteredRestaurants = allRestaurants.filter(
          (restaurant: Restaurant) =>
            restaurant.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFoods(filteredFoods);
        setRestaurants(filteredRestaurants);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  const totalResults = foods.length + restaurants.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">
            Searching for "{searchQuery}"...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-sm font-bold text-gray-900">Search Results</h1>
            <p className="text-xs text-gray-500">"{searchQuery}"</p>
          </div>
          <button className="p-1.5">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for restaurants and food..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              defaultValue={searchQuery}
              readOnly
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "all"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All ({totalResults})
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "foods"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("foods")}
          >
            Foods ({foods.length})
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "restaurants"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("restaurants")}
          >
            Restaurants ({restaurants.length})
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        {totalResults === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-sm text-gray-600 mb-4">Try different keywords</p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:shadow-lg transition-shadow"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Restaurants Results */}
            {(activeTab === "all" || activeTab === "restaurants") &&
              restaurants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Restaurants
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {restaurants.map((restaurant: Restaurant) => (
                      <Link
                        key={restaurant._id}
                        to={`/restaurant/${restaurant._id}`}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors overflow-hidden aspect-square flex flex-col"
                      >
                        <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-orange-50">
                          <img
                            src={restaurant.imageUrl}
                            alt={restaurant.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs rounded-full px-2 py-1 flex items-center gap-0.5 shadow-xs">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold text-gray-900">
                              {restaurant.rating || 4.2}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-2">
                            {restaurant.title}
                          </h4>
                          <div className="space-y-1 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="line-clamp-1">
                                {restaurant.coords?.address?.split(",")[0] ||
                                  "Nearby"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{restaurant.time || "25-30 min"}</span>
                            </div>
                          </div>
                          <div className="mt-auto pt-2 border-t border-gray-100">
                            <div className="text-sm font-bold text-gray-900">
                              ₹{restaurant.deliveryPrice || 25} delivery
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* Foods Results */}
            {(activeTab === "all" || activeTab === "foods") &&
              foods.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Food Items
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {foods.map((food: Food) => (
                      <div
                        key={food._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors overflow-hidden aspect-square flex flex-col"
                      >
                        <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-orange-50">
                          <img
                            src={food.imageUrl}
                            alt={food.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <div className="mb-2">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                              {food.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                              {food.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 fill-current"
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-gray-900">
                              {food.rating || 4.2}
                            </span>
                          </div>
                          <div className="mt-auto pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="text-base font-bold text-gray-900">
                                ₹{food.price}
                              </div>
                              <button
                                onClick={() => addToCart(food)}
                                className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:shadow-sm transition-shadow"
                              >
                                ADD
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </>
        )}
      </div>

      {/* Quick Filters */}
      {totalResults > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {totalResults} results
              </span>
              <span className="text-gray-500 ml-2">for "{searchQuery}"</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
              Sort
            </button>
          </div>
        </div>
      )}

      {/* Spacing for fixed bottom bar */}
      {totalResults > 0 && <div className="h-20"></div>}
    </div>
  );
};

export default SearchPage;
