import React, { useEffect, useState } from "react";
import { Category, Restaurant, Food } from "../types";
import api from "../services/api";
import RestaurantCard from "../components/RestaurantCard";
import FoodCard from "../components/FoodCard";
import { useCart } from "../context/CartContext";
import { Sparkles, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";
import axios from "axios";

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all"
  );
  const { addToCart } = useCart();

  // useEffect(() => {
  //   const fetchAll = async () => {
  //     try {
  //       const [catRes, restRes, foodRes] = await Promise.all([
  //         api.get("/catogary/getAllCategories"),
  //         api.get("/restaurant/getAllRestaurants"),
  //         api.get("/api/food/getAllFoods"),
  //       ]);

  //       setCategories(catRes.data.categories || catRes.data.data || []);
  //       setRestaurants(
  //         restRes.data.restaurants || restRes.data.data || restRes.data
  //       );
  //       setFoods(foodRes.data.foods || foodRes.data.data || []);
  //     } catch (err) {
  //       console.error("Home fetch error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAll();
  // }, []);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // const [catRes, restRes, foodRes] = await Promise.all([
        //   api.get("/catogary/getAllCategories"), // ✅ Matches backend /catogary/*
        //   api.get("/restaurant/getAllRestaurants"), // ✅ Matches /restaurant/*
        //   api.get("/api/food/getAllFoods"), // ✅ Matches /api/food/*
        // ]);
        const catRes = await api.get("/catogary/getAllCategories");
        const restRes = await api.get("/restaurant/getAllRestaurants"); // ✅ Fixed
        const foodRes = await api.get("/api/food/getAllFoods");

        // setCategories(catRes.data || []); // ✅ Simpler data access
        // setRestaurants(restRes.data || []);
        // setFoods(foodRes.data || []);
        // ✅ Safe array access
        // setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        // setRestaurants(Array.isArray(restRes.data) ? restRes.data : []);
        // setFoods(Array.isArray(foodRes.data) ? foodRes.data : []);
        // Full safe version
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
      // setRestaurants(
      //   Array.isArray(restRes.data?.restaurants) ? restRes.data.restaurants : []
      // );
    };

    fetchAll();
  }, []);

  const filteredFoods =
    selectedCategory === "all"
      ? foods
      : foods.filter((f) => f.categoryId === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
        <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Loading delicious foods for you...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 pb-10">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 shadow-sm mb-3">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-gray-700">
                Online Food Ordering...
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
              Order from your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                favourite restaurants
              </span>{" "}
              in minutes
            </h1>
            {/* <p className="text-gray-600 text-sm md:text-base mb-4 max-w-md">
              All data coming directly from your Node.js + MongoDB backend:
              restaurants, categories, foods and orders.
            </p> */}
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-yellow-400 blur-3xl opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-3xl shadow-2xl p-5 w-72">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-800">
                      Today&apos;s Special
                    </span>
                    <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Live orders</span>
                      <span className="font-semibold text-orange-600">
                        {foods.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Restaurants</span>
                      <span className="font-semibold text-pink-600">
                        {restaurants.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Categories</span>
                      <span className="font-semibold text-yellow-600">
                        {categories.length}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-400">
                    Powered by your custom APIs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories
      <section className="max-w-7xl mx-auto px-4 py-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Browse by category
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                : "bg-white/80 text-gray-700 shadow-sm"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === cat._id
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                  : "bg-white/80 text-gray-700 shadow-sm hover:bg-white"
              }`}
            >
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{cat.title}</span>
            </button>
          ))}
        </div>
      </section> */}
      {/* Categories - Clickable Links */}
      <section className="max-w-7xl mx-auto px-4 py-8 bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl my-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🍴 Browse by Category
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 -mb-4 scrollbar-hide">
          {/* All Button - Stays local filter */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all shadow-lg ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-orange-500/50"
                : "bg-white/80 hover:bg-white shadow-sm hover:shadow-md border hover:border-orange-200 text-gray-800"
            }`}
          >
            <div className="w-3 h-10 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full shadow-lg"></div>
            <span>All</span>
          </button>

          {/* Category Links */}
          {categories.slice(0, 8).map(
            (
              cat // Show top 8
            ) => (
              <Link
                key={cat._id}
                to={`/category/${cat._id}`} // ✅ Full page
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all shadow-lg hover:shadow-xl ${
                  selectedCategory === cat._id
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-orange-500/50"
                    : "bg-white/80 hover:bg-white shadow-sm hover:shadow-md border hover:border-orange-200 text-gray-800"
                }`}
              >
                <img
                  src={
                    cat.imageUrl ||
                    ` https://images.unsplash.com/photo-500x400/pizza.jpg}`
                  }
                  alt={cat.title}
                  className="w-10 h-10 rounded-xl object-cover shadow-md"
                />
                <span className="text-sm">{cat.title}</span>
              </Link>
            )
          )}
        </div>

        {/* Show more */}
        {categories.length > 8 && (
          <div className="text-center mt-4">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-lg"
            >
              See all categories <span>→</span>
            </Link>
          </div>
        )}
      </section>

      {/* Restaurants
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Popular restaurants
          </h2>
        </div>
        {restaurants.length === 0 ? (
          <p className="text-sm text-gray-500">
            No restaurants yet. Add from backend.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {restaurants.slice(0, 6).map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        )}
      </section> */}
      {/* All Restaurants - Swiggy Style */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-white/50 backdrop-blur-sm rounded-3xl shadow-2xl my-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            All Restaurants Near You
          </h2>
          <Link
            to="/restaurants"
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-lg transition-colors"
          >
            See All <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
                <span className="text-3xl">🏪</span>
              </div>
              <p className="text-xl font-medium text-gray-500 mb-2">
                No restaurants yet
              </p>
              <p className="text-sm text-gray-400">
                Add restaurants from your admin panel
              </p>
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className="group block bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all overflow-hidden border hover:border-orange-200"
              >
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-50 to-orange-50 group-hover:from-orange-50">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/400/300";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 line-clamp-2 leading-tight group-hover:text-orange-700 transition-colors">
                    {restaurant.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-sm text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(restaurant.rating || 0)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-semibold text-gray-900">
                      {restaurant.rating || 4.2} ({restaurant.ratingCount || 23}
                      )
                    </span>
                  </div>

                  {/* Location & Time */}
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {restaurant.coords?.address?.slice(0, 40) || "Nearby"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{restaurant.time || "25-30 mins"}</span>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-bold text-lg text-orange-600">
                      {restaurant.deliveryPrice || "₹25"} delivery
                    </span>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        restaurant.isOpen
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {restaurant.isOpen ? "OPEN" : "CLOSED"}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Foods */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedCategory === "all" ? "All foods" : "Foods in category"}
          </h2>
        </div>
        {filteredFoods.length === 0 ? (
          <p className="text-sm text-gray-500">
            No foods found. Create foods in your backend.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredFoods.map((f) => (
              <FoodCard key={f._id} food={f} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
