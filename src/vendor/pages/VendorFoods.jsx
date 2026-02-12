// src/vendor/pages/VendorFoods.jsx
import React, { useState, useEffect } from "react";
import {
  // ... other icons,
  Utensils, // Add this
} from "lucide-react";
import { IMAGE_URLS } from "../utils/imageUrls";
import {
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Image as ImageIcon,
} from "lucide-react";
import { useVendor } from "../context/VendorContext";
import {
  getVendorFoods,
  createVendorFood,
  updateVendorFood,
  deleteVendorFood,
  toggleFoodAvailability,
} from "../api/vendorApi";

const VendorFoods = () => {
  const { restaurant } = useVendor();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    foodTags: "",
    imageUrl: "",
    categoryId: "",
    code: "",
    isAvailable: true,
    rating: "5",
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await getVendorFoods();
      if (response.data.status) {
        setFoods(response.data.foods);
      }
    } catch (error) {
      console.error("Error fetching foods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateVendorFood(editingId, formData);
      } else {
        await createVendorFood(formData);
      }
      resetForm();
      fetchFoods();
    } catch (error) {
      console.error("Error saving food:", error);
      alert("Failed to save food");
    }
  };

  const handleEdit = (food) => {
    setFormData({
      title: food.title,
      description: food.description,
      price: String(food.price),
      foodTags: food.foodTags?.join(", ") || "",
      imageUrl: food.imageUrl,
      categoryId: food.categoryId?._id || food.categoryId,
      code: food.code || "",
      isAvailable: food.isAvailable,
      rating: String(food.rating || "5"),
    });
    setEditingId(food._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await deleteVendorFood(id);
        fetchFoods();
      } catch (error) {
        console.error("Error deleting food:", error);
        alert("Failed to delete food");
      }
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await toggleFoodAvailability(id);
      // Update local state
      setFoods(
        foods.map((food) =>
          food._id === id ? { ...food, isAvailable: !currentStatus } : food
        )
      );
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      foodTags: "",
      imageUrl: "",
      categoryId: "",
      code: "",
      isAvailable: true,
      rating: "5",
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Filter foods
  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterAvailable === "all"
        ? true
        : filterAvailable === "available"
        ? food.isAvailable
        : !food.isAvailable;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add New Food"}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search foods by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-4">
          <Filter className="text-gray-400" size={20} />
          <select
            value={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Items</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable Only</option>
          </select>
        </div>
      </div>

      {/* Food Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Food Item" : "Add New Food Item"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Margherita Pizza"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="299"
                  required
                  min="0"
                  step="1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your food item..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Tags
                </label>
                <input
                  type="text"
                  value={formData.foodTags}
                  onChange={(e) =>
                    setFormData({ ...formData, foodTags: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="spicy, vegetarian, gluten-free (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="PIZZA-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category ID *
                </label>
                <input
                  type="text"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category ID"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get category ID from Categories page
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-5)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Stars
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/food-image.jpg"
                  />
                  <button
                    type="button"
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Paste a direct image URL
                </p>
              </div>

              {formData.imageUrl && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <div className="w-32 h-32 rounded-lg overflow-hidden border">
                    <img
                      src={formData.imageUrl || IMAGE_URLS.DEFAULT_FOOD}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = IMAGE_URLS.DEFAULT_FOOD;
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAvailable: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Available for ordering
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
              >
                {editingId ? "Update Food" : "Create Food"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Food Image */}
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={food.imageUrl || IMAGE_URLS.DEFAULT_FOOD}
                  alt={food.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200";
                  }}
                />
                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() =>
                      handleToggleAvailability(food._id, food.isAvailable)
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      food.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {food.isAvailable ? (
                      <ToggleRight className="w-4 h-4" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                    {food.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </div>
              </div>

              {/* Food Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {food.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {food.categoryId?.title || "Category"}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900">₹{food.price}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {food.description}
                </p>

                {/* Tags */}
                {food.foodTags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {food.foodTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(food.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">
                      {food.rating || "5.0"}
                    </span>
                  </div>
                  {food.code && (
                    <span className="text-xs text-gray-500">#{food.code}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(food)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-3 text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No food items found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterAvailable !== "all"
                ? "Try changing your search or filter"
                : "Start by adding your first food item"}
            </p>
            <button
              onClick={() => {
                setShowForm(true);
                setSearchTerm("");
                setFilterAvailable("all");
              }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Your First Food
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Menu Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{foods.length}</p>
            <p className="text-sm text-blue-700">Total Items</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {foods.filter((f) => f.isAvailable).length}
            </p>
            <p className="text-sm text-green-700">Available</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {foods.filter((f) => !f.isAvailable).length}
            </p>
            <p className="text-sm text-yellow-700">Unavailable</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              ₹{foods.reduce((sum, food) => sum + food.price, 0)}
            </p>
            <p className="text-sm text-purple-700">Total Menu Value</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorFoods;
