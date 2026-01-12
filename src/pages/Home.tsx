import React, { useEffect, useState } from "react";
import { Category, Restaurant, Food } from "../types";
import api from "../services/api";
import RestaurantCard from "../components/RestaurantCard";
import FoodCard from "../components/FoodCard";
import { useCart } from "../context/CartContext";
import {
  Sparkles,
  UtensilsCrossed,
  Search,
  Star,
  MapPin,
  Clock,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all"
  );
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const catRes = await api.get("/catogary/getAllCategories");
        const restRes = await api.get("/restaurant/getAllRestaurants");
        const foodRes = await api.get("/api/food/getAllFoods");

        setCategories(
          Array.isArray(catRes.data?.categories) ? catRes.data.categories : []
        );
        setRestaurants(
          Array.isArray(restRes.data?.restaurants)
            ? restRes.data.restaurants
            : []
        );
        setFoods(Array.isArray(foodRes.data?.foods) ? foodRes.data.foods : []);
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const filteredFoods =
    selectedCategory === "all"
      ? foods
      : foods.filter((f) => f.categoryId === selectedCategory);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">
            Loading delicious foods...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Food Mart</h1>
                <p className="text-xs text-gray-500">
                  Online Food Delivery App
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for restaurants and food..."
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Hero Banner - Mobile */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Order Now</span>
              </div>
              <h2 className="text-xl font-bold">
                Craving Something Delicious?
              </h2>
            </div>
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <p className="text-sm opacity-90 mb-4">
            Get food delivered in 30 minutes
          </p>
          <button
            onClick={() => navigate("/restaurants")}
            className="w-full bg-white text-orange-600 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Categories - Horizontal Scroll */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900">Categories</h3>
          <Link
            to="/categories"
            className="text-xs text-orange-500 font-medium flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex flex-col items-center p-2 rounded-xl min-w-[70px] ${
              selectedCategory === "all"
                ? "bg-orange-50 border border-orange-200"
                : "bg-gray-50"
            }`}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center mb-1">
              <span className="text-white text-lg">🍕</span>
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1">All</span>
          </button>
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`flex flex-col items-center p-2 rounded-xl min-w-[70px] ${
                selectedCategory === cat._id
                  ? "bg-orange-50 border border-orange-200"
                  : "bg-gray-50"
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-1 overflow-hidden">
                <img
                  src={
                    cat.imageUrl ||
                    "https://images.unsplash.com/photo-500x400/pizza.jpg"
                  }
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 mt-1 line-clamp-1">
                {cat.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants - Square Cards */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Top Restaurants</h3>
            <p className="text-xs text-gray-500">
              {restaurants.length} places near you
            </p>
          </div>
          <Link
            to="/restaurants"
            className="text-sm text-orange-500 font-medium flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {restaurants.length === 0 ? (
            <div className="col-span-2 text-center py-8 px-4 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                No restaurants yet
              </p>
              <p className="text-xs text-gray-500">Check back soon</p>
            </div>
          ) : (
            restaurants.slice(0, 6).map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors overflow-hidden aspect-square flex flex-col"
              >
                {/* Square Image */}
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

                {/* Square Content */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="mb-2">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                      {restaurant.title}
                    </h4>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {restaurant.coords?.address?.split(",")[0] || "Nearby"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{restaurant.time || "25-30 min"}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-gray-900">
                        ₹{restaurant.deliveryPrice || 25}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          restaurant.isOpen
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {restaurant.isOpen ? "OPEN" : "CLOSED"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Foods - Square Cards with See All Link */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {selectedCategory === "all" ? "Popular Dishes" : "Menu Items"}
            </h3>
            <p className="text-xs text-gray-500">
              {filteredFoods.length} items available
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/all-foods"
              className="text-sm text-orange-500 font-medium flex items-center gap-1"
            >
              See all <ChevronRight className="w-3 h-3" />
            </Link>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              <Filter className="w-3 h-3" />
              Filter
            </button>
          </div>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="text-center py-8 px-4 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              No items found
            </p>
            <p className="text-xs text-gray-500">Try another category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredFoods.slice(0, 8).map((food) => (
              <Link
                key={food._id}
                to={`/food/${food._id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors overflow-hidden aspect-square flex flex-col"
              >
                {/* Square Food Image */}
                <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-orange-50">
                  <img
                    src={food.imageUrl}
                    alt={food.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Square Food Content */}
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
                        <Star key={i} className="w-3 h-3 fill-current" />
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
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(food);
                        }}
                        className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:shadow-sm transition-shadow"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-orange-50 rounded-xl">
            <div className="text-lg font-bold text-orange-600">
              {foods.length}
            </div>
            <div className="text-xs text-gray-600">Food Items</div>
          </div>
          <div className="p-3 bg-red-50 rounded-xl">
            <div className="text-lg font-bold text-red-600">
              {restaurants.length}
            </div>
            <div className="text-xs text-gray-600">Restaurants</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-xl">
            <div className="text-lg font-bold text-yellow-600">
              {categories.length}
            </div>
            <div className="text-xs text-gray-600">Categories</div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Info */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">
          FoodApp • Order food from your favorite restaurants
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-4">FoodApp</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    FoodApp One
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Help & Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Partner With Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Ride With Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Investor Relations
                  </a>
                </li>
              </ul>
            </div>

            {/* Cities */}
            <div>
              <h4 className="font-bold text-lg mb-4">We Deliver To</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Bangalore
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Delhi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Mumbai
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    View All Cities →
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media & App Stores */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Follow us on:</span>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                  >
                    <span className="text-lg">📘</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                  >
                    <span className="text-lg">🐦</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                  >
                    <span className="text-lg">📷</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                  >
                    <span className="text-lg">▶️</span>
                  </a>
                </div>
              </div>

              {/* App Stores */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                    <span className="text-black font-bold text-xs">A</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                    <span className="text-black font-bold text-xs">P</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <p className="text-sm text-gray-400">
                © 2024 FoodApp. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                By continuing past this page, you agree to our Terms of Service,
                Cookie Policy, Privacy Policy and Content Policies.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
