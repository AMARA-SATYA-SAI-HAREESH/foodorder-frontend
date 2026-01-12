import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Search,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-orange-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-600">
            Loading restaurants...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-orange-500 hover:text-red-500 p-1">
            ←
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Restaurants</h1>
            <p className="text-xs text-gray-500">
              {restaurants.length} places near you
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
            <Filter className="w-3 h-3" />
            Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
            <SlidersHorizontal className="w-3 h-3" />
            Sort: Rating
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
            Fast Delivery
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
            Pure Veg
          </button>
        </div>
      </div>

      {/* Restaurant Grid - PERFECT SQUARE CARDS */}
      <div className="p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filteredRestaurants.length === 0 ? (
            <div className="col-span-full text-center py-12 px-4 bg-white rounded-xl border border-gray-200 m-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No restaurants found
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Try different search terms
              </p>
              <button
                onClick={() => setSearch("")}
                className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-orange-300 transition-all duration-200 overflow-hidden aspect-square flex flex-col"
              >
                {/* Square Image Container */}
                <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-orange-50">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs rounded-full px-2 py-1 flex items-center gap-0.5 shadow-xs">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-gray-900">
                      {restaurant.rating || 4.2}
                    </span>
                  </div>
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-white px-3 py-1 rounded-md text-xs font-bold text-gray-900">
                        CLOSED
                      </div>
                    </div>
                  )}
                </div>

                {/* Square Content Area */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="mb-2">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
                      {restaurant.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 mb-3">
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

        {/* View More */}
        {filteredRestaurants.length > 0 &&
          filteredRestaurants.length < restaurants.length && (
            <div className="text-center py-6">
              <div className="text-xs text-gray-500 mb-3">
                Showing {filteredRestaurants.length} of {restaurants.length}{" "}
                restaurants
              </div>
              <button className="text-sm bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Load More
              </button>
            </div>
          )}
      </div>

      {/* Mobile Bottom Info */}
      <div className="p-4 bg-white border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          {filteredRestaurants.length} restaurants • Updated just now
        </p>
      </div>
    </div>
  );
};

export default Restaurants;
