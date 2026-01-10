import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";
import api from "../services/api";
import { Restaurant } from "../types";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/restaurant/getAllRestaurants")
      .then((res) => {
        setRestaurants(res.data.restaurants || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orange-500 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            All Restaurants ({restaurants.length})
          </h1>

          {/* Search */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search restaurants..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/restaurant/${restaurant._id}`}
              className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden"
            >
              <img
                src={restaurant.imageUrl}
                alt={restaurant.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{restaurant.title}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-sm font-medium">
                    {restaurant.rating}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{restaurant.coords?.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{restaurant.time}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-500 text-lg">
                    ₹25 delivery
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      restaurant.isOpen
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {restaurant.isOpen ? "OPEN" : "CLOSED"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
