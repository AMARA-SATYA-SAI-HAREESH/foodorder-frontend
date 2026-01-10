import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import api from "../services/api";
import { Food, Category } from "../types";
import { useCart } from "../context/CartContext";
import FoodCard from "../components/FoodCard";

const CategoryPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [category, setCategory] = useState<Category | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        // 1. Get category details
        const catRes = await api.get(`/catogary/getAllCategories`);
        const foundCategory = catRes.data.categories?.find(
          (c: Category) => c._id === id
        );
        setCategory(foundCategory || null);

        // 2. Get foods in this category
        const foodsRes = await api.get(`/api/food/getFoodsbycategory?id=${id}`);
        setFoods(foodsRes.data.foods || []);
      } catch (error) {
        console.error("Category fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading category foods...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category not found</h2>
          <Link to="/" className="text-orange-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex-shrink-0">
              <img
                src={
                  category.imageUrl ||
                  "https://via.placeholder.com/200x200/ffe4e1/f97316?text=Category"
                }
                alt={category.title}
                className="w-32 h-32 lg:w-48 lg:h-48 rounded-3xl object-cover shadow-2xl"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {category.title}
              </h1>
              <p className="text-xl opacity-90 mb-6">
                {foods.length} foods available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Foods Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {foods.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-8 p-8 bg-gradient-to-r from-gray-100 to-orange-100 rounded-3xl flex items-center justify-center">
              <span className="text-4xl">🍲</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              No foods in this category yet
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              Restaurants will add their menu items here soon
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-3xl font-semibold hover:shadow-xl transition-all text-lg"
              >
                ← Explore Home
              </Link>
              <Link
                to="/admin"
                className="px-8 py-4 border-2 border-gray-300 rounded-3xl font-semibold hover:bg-gray-50 transition-all text-lg"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-10 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">
                Menu ({foods.length} items)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {foods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  onAddToCart={addToCart}
                  className="shadow-xl hover:shadow-2xl transition-all"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
