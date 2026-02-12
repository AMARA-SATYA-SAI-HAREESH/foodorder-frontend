import React, { useEffect, useState } from "react";
import { Category, Restaurant, Food } from "../types";
import api from "../services/api";
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
  Flame,
  Award,
  Truck,
  Shield,
  User,
  ShoppingBag,
  ChevronLeft,
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
    "all",
  );
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, restRes, foodRes] = await Promise.all([
          api.get("/catogary/getAllCategories"),
          api.get("/restaurant/getAllRestaurants"),
          api.get("/api/food/getAllFoods"),
        ]);

        setCategories(
          Array.isArray(catRes.data?.categories) ? catRes.data.categories : [],
        );
        setRestaurants(
          Array.isArray(restRes.data?.restaurants)
            ? restRes.data.restaurants
            : [],
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-200 to-teal-200 animate-pulse mb-6 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UtensilsCrossed className="w-12 h-12 text-emerald-600 animate-bounce" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Loading Culinary Delights
          </h3>
          <p className="text-slate-600">Preparing your food experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50">
      {/* Modern Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">FM</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                <Flame className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-emerald-700 bg-clip-text text-transparent">
                FoodVerse
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Taste the Difference
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ShoppingBag className="w-6 h-6 text-slate-700" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center hover:shadow-lg transition-shadow">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-emerald-700">
                  Premium Delivery Partner
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Savor Every Bite,
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Delivered Fresh
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Experience gourmet meals from top-rated restaurants delivered
                straight to your door in minutes.
              </p>

              <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="What are you craving today?"
                  className="w-full pl-12 pr-12 py-4 text-base bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-lg placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <X className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  </button>
                )}
              </form>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/restaurants")}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Order Now
                </button>
                <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-colors">
                  View Menu
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-8 shadow-2xl border border-emerald-100">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center"
                    >
                      <div className="text-4xl">🍕</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-2xl opacity-30"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Explore Categories
            </h2>
            <p className="text-slate-600">
              Browse our diverse culinary selection
            </p>
          </div>
          <Link
            to="/categories"
            className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 group"
          >
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`group relative p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl scale-105"
                : "bg-white text-slate-700 shadow-lg hover:shadow-xl hover:-translate-y-1"
            }`}
          >
            <div className="text-3xl mb-3">🍕</div>
            <span className="text-sm font-semibold">All</span>
          </button>

          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`group relative p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                selectedCategory === cat._id
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl scale-105"
                  : "bg-white text-slate-700 shadow-lg hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50 mb-3 flex items-center justify-center overflow-hidden">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-2xl">🍽️</div>
                )}
              </div>
              <span className="text-sm font-semibold text-center line-clamp-1">
                {cat.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Top Restaurants
            </h2>
            <p className="text-slate-600">
              {restaurants.length} premium partners near you
            </p>
          </div>
          <Link
            to="/restaurants"
            className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 group"
          >
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.slice(0, 6).map((restaurant) => (
            <div
              key={restaurant._id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-slate-900">
                    {restaurant.rating || 4.5}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      restaurant.isOpen
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {restaurant.isOpen ? "OPEN" : "CLOSED"}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                      {restaurant.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span className="line-clamp-1">
                        {restaurant.coords?.address?.split(",")[0] ||
                          "City Center"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">
                      ₹{restaurant.deliveryPrice || 25}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{restaurant.time || "25-30 min"}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                  className="w-full py-3 bg-gradient-to-r from-slate-50 to-emerald-50 text-slate-900 font-semibold rounded-xl border border-emerald-200 hover:border-emerald-500 transition-colors group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-600 group-hover:text-white"
                >
                  View Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Foods */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {selectedCategory === "all" ? "Popular Dishes" : "Featured Items"}
            </h2>
            <p className="text-slate-600">
              {filteredFoods.length} delicious options available
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-3 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-emerald-500 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <Link
              to="/all-foods"
              className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 group"
            >
              See All
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.slice(0, 8).map((food) => (
            <div
              key={food._id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={food.imageUrl}
                  alt={food.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                    Popular
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                    {food.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {food.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {food.rating || 4.5}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">
                      ₹{food.price}
                    </div>
                    <div className="text-xs text-slate-500">per serving</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(food);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats & Features */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-bold">{restaurants.length}+</div>
                <div className="text-sm opacity-90">Premium Restaurants</div>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Partnered with the best culinary experts
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-90">Food Safety</div>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Hygienic preparation & contactless delivery
            </p>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-bold">30min</div>
                <div className="text-sm opacity-90">Average Delivery</div>
              </div>
            </div>
            <p className="text-sm opacity-90">Fastest delivery in the city</p>
          </div>
        </div>
      </div>

      {/* App Download CTA */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Get the <span className="text-emerald-400">FoodVerse</span> App
              </h2>
              <p className="text-slate-300 mb-8 text-lg">
                Order food, track delivery, and enjoy exclusive offers with our
                mobile app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Download on</div>
                    <div className="font-bold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-slate-800 text-white px-6 py-4 rounded-2xl hover:bg-slate-700 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <span className="text-slate-900 font-bold">P</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Get it on</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border border-emerald-800/30 backdrop-blur-sm flex items-center justify-center"
                    >
                      <div className="text-3xl">📱</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-white font-bold">FV</span>
                </div>
                <div>
                  <div className="font-bold text-lg">FoodVerse</div>
                  <div className="text-xs text-slate-400">Premium Delivery</div>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Redefining food delivery with premium quality and exceptional
                service.
              </p>
            </div>

            {["Company", "Support", "Legal", "Cities"].map((section) => (
              <div key={section}>
                <h4 className="font-bold text-lg mb-6">{section}</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-emerald-400 transition-colors"
                      >
                        Link {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-sm text-slate-400">
                © 2024 FoodVerse. All rights reserved.
              </div>
              <div className="flex gap-4">
                {["📘", "🐦", "📷", "▶️"].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors hover:scale-105"
                  >
                    <span className="text-lg">{icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
