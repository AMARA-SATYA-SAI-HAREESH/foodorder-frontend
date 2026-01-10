import React from "react";
import { Restaurant } from "../types";
import { MapPin, Clock, Truck, Star, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";
import { Link } from "react-router-dom";

interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  className,
}) => {
  const isOpen = restaurant.isOpen;
  const deliveryAvailable = restaurant.delivery;
  const pickupAvailable = restaurant.pickUp;

  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className={cn(
        "group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-orange-200 h-full flex flex-col",
        className
      )}
    >
      {/* Image + Status */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.imageUrl || "/api/placeholder/400/200"}
          alt={restaurant.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Open status */}
        <div
          className={cn(
            "absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
            isOpen
              ? "bg-emerald-500/90 text-white backdrop-blur-sm"
              : "bg-orange-500/90 text-white backdrop-blur-sm"
          )}
        >
          {isOpen ? "Open Now" : "Closed"}
        </div>

        {/* Logo */}
        {restaurant.logoUrl && (
          <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl overflow-hidden shadow-lg border-4 border-white/80">
            <img
              src={restaurant.logoUrl}
              alt={`${restaurant.title} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title + Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-800 line-clamp-1 pr-4 flex-1">
            {restaurant.title}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span className="text-sm font-bold text-yellow-700">
              {restaurant.rating}
            </span>
            <span className="text-xs text-gray-600">
              ({restaurant.ratingCount})
            </span>
          </div>
        </div>

        {/* Delivery/Pickup badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {deliveryAvailable && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              <Truck className="w-3 h-3" />
              Delivery
            </div>
          )}
          {pickupAvailable && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              <Clock className="w-3 h-3" />
              Pick-up
            </div>
          )}
          {restaurant.time && (
            <span className="text-xs text-gray-500">{restaurant.time}</span>
          )}
        </div>

        {/* Address */}
        {restaurant.coords?.address && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 p-2 bg-gray-50 rounded-xl">
            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="line-clamp-1">{restaurant.coords.address}</span>
          </div>
        )}

        {/* View Menu button */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">View Menu</span>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
