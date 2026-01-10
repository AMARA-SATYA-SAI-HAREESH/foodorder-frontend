import React from "react";
import { Food, CartItem } from "../types";
import { ShoppingCart, Star } from "lucide-react";
import { cn } from "../utils"; // helper for Tailwind classes
import { Link } from "react-router-dom";

interface FoodCardProps {
  food: Food;
  onAddToCart: (food: Food) => void;
  className?: string;
}

const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onAddToCart,
  className,
}) => {
  return (
    <Link to={`/food/${food._id}`} className="block">
      <div
        className={cn(
          "group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-orange-200",
          className
        )}
      >
        {/* Image */}
        <div className="h-56 overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
          <img
            src={food.imageUrl || "pizzafood.jpg"}
            alt={food.title}
            className="w-full h-full object-cover"
          />
          {!food.isAvailable && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-xl font-bold px-4 py-2 bg-red-500 rounded-full">
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-xl text-gray-800 line-clamp-1 pr-4">
              {food.title}
            </h3>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-sm font-semibold">{food.rating}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {food.description}
          </p>

          {/* Tags */}
          {food.foodTags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {food.foodTags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price & Add Button */}
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-2xl font-bold text-orange-600">
              ₹{food.price}
            </span>
            <button
              // onClick={() => onAddToCart(food)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(food);
              }}
              disabled={!food.isAvailable}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all shadow-lg",
                food.isAvailable
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-orange-500/25 hover:scale-105 active:scale-95"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {food.isAvailable ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
