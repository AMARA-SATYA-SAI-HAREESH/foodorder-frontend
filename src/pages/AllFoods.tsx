import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Search, Filter, ChevronLeft, ShoppingCart } from "lucide-react";
import api from "../services/api";
import { Food } from "../types";
import { useCart } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

const AllFoods: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<any[]>([]);
  const { addToCart } = useCart();

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch all foods
      console.log("🌐 Fetching all foods...");
      const foodsRes = await api.get("/api/food/getAllFoods");
      console.log("Foods response:", foodsRes.data);

      const foodsData = Array.isArray(foodsRes.data?.foods)
        ? foodsRes.data.foods
        : Array.isArray(foodsRes.data)
          ? foodsRes.data
          : [];

      // Fetch categories for filter
      const catRes = await api.get("/catogary/getAllCategories");
      const categoriesData = Array.isArray(catRes.data?.categories)
        ? catRes.data.categories
        : [];

      setFoods(foodsData);
      setFilteredFoods(foodsData);
      setCategories(categoriesData);

      console.log(`✅ Loaded ${foodsData.length} foods`);
    } catch (error) {
      console.error("Error fetching foods:", error);
      toast.error("Failed to load foods. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter foods based on search and category
  useEffect(() => {
    let result = foods;

    if (searchQuery) {
      result = result.filter(
        (food) =>
          food.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (food.description &&
            food.description.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((food) => food.categoryId === selectedCategory);
    }

    setFilteredFoods(result);
  }, [searchQuery, selectedCategory, foods]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious foods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">All Foods</h1>
          <button className="p-2">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-3 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === cat._id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="px-4 pb-3 text-sm text-gray-600">
          {filteredFoods.length} items found
        </div>
      </div>

      {/* Foods Grid */}
      <div className="p-4">
        {filteredFoods.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No foods found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchQuery
                ? "Try different keywords"
                : "Check back later for new items"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-orange-500 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredFoods.map((food) => (
              <Link
                key={food._id}
                to={`/food/${food._id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors overflow-hidden flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-orange-50">
                  <img
                    src={
                      food.imageUrl ||
                      "https://via.placeholder.com/300x200?text=Food"
                    }
                    alt={food.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x200?text=Food+Image";
                    }}
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                    {food.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {food.description}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (food.rating || 4)
                              ? "fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-900">
                      {food.rating || 4.2}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">
                      ₹{food.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(food);
                        toast.success(`✅ ${food.title} added to cart!`);
                      }}
                      className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:shadow-sm transition-shadow flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFoods;
