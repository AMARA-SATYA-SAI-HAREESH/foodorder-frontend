import React, { useState, useEffect, useCallback } from "react";
import {
  Package,
  Utensils,
  Store,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllOrders,
  changeOrderStatus,
  getAllUsers,
  deleteUser,
  createUser,
  updateUser,
} from "./adminApi";

interface Category {
  _id: string;
  title: string;
  imageUrl: string;
}

interface Food {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  restaurantId: string;
  rating?: number;
}

interface Restaurant {
  _id: string;
  title: string;
  address: string;
  imageUrl: string;
  isOpen: boolean;
  rating?: number;
  deliveryPrice?: number;
  time?: string;
}

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user?: any;
  items: Array<any>;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "categories" | "foods" | "restaurants" | "orders" | "users"
  >("categories");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    categories: [] as Category[],
    foods: [] as Food[],
    restaurants: [] as Restaurant[],
    orders: [] as Order[],
    users: [] as any[],
  });

  // Form states
  const [categoryForm, setCategoryForm] = useState({ title: "", imageUrl: "" });
  const [foodForm, setFoodForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    restaurantId: "",
  });
  const [restaurantForm, setRestaurantForm] = useState({
    title: "",
    address: "",
    imageUrl: "",
    isOpen: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state for order
  const [orderForm, setOrderForm] = useState({
    _id: "",
    status: "",
    totalAmount: "",
    createdAt: "",
  });
  // Form state for user
  const [userForm, setUserForm] = useState({
    userName: "",
    email: "",
    password: "",
    address: "",
    userType: "",
    answer: "",
    phone: "",
    profile: "",
  });

  // Fetch data based on active tab
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log(`Fetching ${activeTab} from correct endpoints...`);

      switch (activeTab) {
        case "categories":
          console.log("Calling: /catogary/getAllCategories");
          const categoriesRes = await getAllCategories();
          console.log("Categories response:", categoriesRes.data);
          setData((prev) => ({
            ...prev,
            categories:
              categoriesRes.data?.categories || categoriesRes.data || [],
          }));
          break;

        case "foods":
          console.log("Calling: /api/food/getAllFoods");
          const foodsRes = await getAllFoods();
          console.log("Foods response:", foodsRes.data);
          setData((prev) => ({
            ...prev,
            foods: foodsRes.data?.foods || foodsRes.data || [],
          }));
          break;

        case "restaurants":
          console.log("Calling: /restaurant/getAllRestaurants");
          const restaurantsRes = await getAllRestaurants();
          console.log("Restaurants response:", restaurantsRes.data);
          setData((prev) => ({
            ...prev,
            restaurants:
              restaurantsRes.data?.restaurants || restaurantsRes.data || [],
          }));
          break;

        case "orders":
          console.log("Calling: /api/order/getAllOrders");
          try {
            const ordersRes = await getAllOrders();
            console.log("Orders response:", ordersRes.data);
            setData((prev) => ({
              ...prev,
              orders: Array.isArray(ordersRes.data)
                ? ordersRes.data
                : ordersRes.data?.orders || [],
            }));
          } catch (orderError: any) {
            console.error(
              "Orders API failed:",
              orderError.response?.data || orderError.message
            );
          }
          break;
        case "users":
          try {
            const usersRes = await getAllUsers();
            setData((prev) => ({
              ...prev,
              users: usersRes.data?.users || usersRes.data || [],
            }));
          } catch (err) {
            console.error("Error fetching users:", err);
          }
          break;

        default:
          break;
      }
    } catch (error: any) {
      console.error(`Error fetching ${activeTab}:`, error);
      console.error("Error details:", error.response?.data);
      console.error("Error URL:", error.config?.url);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Category handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory({ id: editingId, ...categoryForm });
      } else {
        await createCategory(categoryForm);
      }
      setCategoryForm({ title: "", imageUrl: "" });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    }
  };

  const handleCategoryEdit = (category: Category) => {
    setCategoryForm({ title: category.title, imageUrl: category.imageUrl });
    setEditingId(category._id);
  };

  const handleCategoryDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  };

  // Food handlers
  const handleFoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateFood({ id: editingId, ...foodForm });
      } else {
        await createFood(foodForm);
      }
      setFoodForm({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryId: "",
        restaurantId: "",
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Error saving food:", error);
      alert("Failed to save food");
    }
  };

  const handleFoodEdit = (food: Food) => {
    setFoodForm({
      title: food.title,
      description: food.description,
      price: String(food.price),
      imageUrl: food.imageUrl,
      categoryId: food.categoryId,
      restaurantId: food.restaurantId,
    });
    setEditingId(food._id);
  };

  const handleFoodDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this food?")) {
      try {
        await deleteFood(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting food:", error);
        alert("Failed to delete food");
      }
    }
  };

  // Restaurant handlers
  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRestaurant({ id: editingId, ...restaurantForm });
      } else {
        await createRestaurant(restaurantForm);
      }
      setRestaurantForm({
        title: "",
        address: "",
        imageUrl: "",
        isOpen: true,
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Error saving restaurant:", error);
      alert("Failed to save restaurant");
    }
  };

  const handleRestaurantEdit = (restaurant: Restaurant) => {
    setRestaurantForm({
      title: restaurant.title,
      address: restaurant.address,
      imageUrl: restaurant.imageUrl,
      isOpen: restaurant.isOpen,
    });
    setEditingId(restaurant._id);
  };

  const handleRestaurantDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await deleteRestaurant(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        alert("Failed to delete restaurant");
      }
    }
  };

  // Order handlers
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update order (you need to implement this API)
        // await updateOrder(orderForm);
      } else {
        // Create order (you need to implement this API)
        // await createOrder(orderForm);
      }
      setOrderForm({
        _id: "",
        status: "",
        totalAmount: "",
        createdAt: "",
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order");
    }
  };

  const handleOrderEdit = (order: Order) => {
    setOrderForm({
      _id: order._id,
      status: order.status,
      totalAmount: String(order.totalAmount),
      createdAt: new Date(order.createdAt).toISOString().slice(0, 16),
    });
    setEditingId(order._id);
  };

  const handleOrderDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        // await deleteOrder(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      }
    }
  };
  // User handlers
  // User handlers
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser(editingId, userForm); // send full userForm
      } else {
        await createUser(userForm); // send full userForm
      }
      setUserForm({
        userName: "",
        email: "",
        password: "",
        address: "",
        userType: "",
        answer: "",
        phone: "",
        profile: "",
      });
      setEditingId(null);
      fetchData(); // reload users from backend
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user");
    }
  };

  const handleUserDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        fetchData(); // reload users
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  // Order status handler
  const handleOrderStatusChange = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      await changeOrderStatus(orderId, newStatus);
      fetchData();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "preparing":
          return "bg-blue-100 text-blue-800";
        case "delivered":
          return "bg-green-100 text-green-800";
        case "completed":
          return "bg-purple-100 text-purple-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
          status
        )}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage all aspects of your food delivery system
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.categories.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Foods</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.foods.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Utensils className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Restaurants</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.restaurants.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.orders.filter((o) => o.status === "PENDING").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 border-b border-gray-200">
          {[
            { id: "categories", label: "Categories", icon: Package },
            { id: "foods", label: "Foods", icon: Utensils },
            { id: "restaurants", label: "Restaurants", icon: Store },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "users", label: "Users", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Category List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Categories List
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {data.categories.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No categories found
                        </p>
                      ) : (
                        data.categories.map((category) => (
                          <div
                            key={category._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                <img
                                  src={category.imageUrl}
                                  alt={category.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://via.placeholder.com/48";
                                  }}
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {category.title}
                                </h4>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCategoryEdit(category)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleCategoryDelete(category._id)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Category Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? "Edit Category" : "Create New Category"}
                    </h3>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category Name
                        </label>
                        <input
                          type="text"
                          value={categoryForm.title}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., Pizza, Burger"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={categoryForm.imageUrl}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              imageUrl: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>
                      {categoryForm.imageUrl && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <div className="w-32 h-32 rounded-lg overflow-hidden border">
                            <img
                              src={categoryForm.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/128";
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {editingId ? "Update Category" : "Create Category"}
                        </button>
                        {editingId && (
                          <button
                            type="button"
                            onClick={() => {
                              setCategoryForm({ title: "", imageUrl: "" });
                              setEditingId(null);
                            }}
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Foods Tab */}
            {activeTab === "foods" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Food List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Foods List
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {data.foods.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No foods found
                        </p>
                      ) : (
                        data.foods.map((food) => (
                          <div
                            key={food._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                <img
                                  src={food.imageUrl}
                                  alt={food.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://via.placeholder.com/48";
                                  }}
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {food.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  ₹{food.price} · {food.categoryId}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleFoodEdit(food)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleFoodDelete(food._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Food Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? "Edit Food" : "Create New Food"}
                    </h3>
                    <form onSubmit={handleFoodSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Food Name
                        </label>
                        <input
                          type="text"
                          value={foodForm.title}
                          onChange={(e) =>
                            setFoodForm({ ...foodForm, title: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., Margherita Pizza"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={foodForm.description}
                          onChange={(e) =>
                            setFoodForm({
                              ...foodForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          rows={3}
                          placeholder="Enter food description"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={foodForm.price}
                          onChange={(e) =>
                            setFoodForm({ ...foodForm, price: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., 299"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={foodForm.imageUrl}
                          onChange={(e) =>
                            setFoodForm({
                              ...foodForm,
                              imageUrl: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={foodForm.categoryId}
                          onChange={(e) =>
                            setFoodForm({
                              ...foodForm,
                              categoryId: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        >
                          <option value="">Select Category</option>
                          {data.categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Restaurant
                        </label>
                        <select
                          value={foodForm.restaurantId}
                          onChange={(e) =>
                            setFoodForm({
                              ...foodForm,
                              restaurantId: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        >
                          <option value="">Select Restaurant</option>
                          {data.restaurants.map((res) => (
                            <option key={res._id} value={res._id}>
                              {res.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      {foodForm.imageUrl && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <div className="w-32 h-32 rounded-lg overflow-hidden border">
                            <img
                              src={foodForm.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/128";
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {editingId ? "Update Food" : "Create Food"}
                        </button>
                        {editingId && (
                          <button
                            type="button"
                            onClick={() => {
                              setFoodForm({
                                title: "",
                                description: "",
                                price: "",
                                imageUrl: "",
                                categoryId: "",
                                restaurantId: "",
                              });
                              setEditingId(null);
                            }}
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Restaurants Tab */}
            {activeTab === "restaurants" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Restaurant List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Restaurants List
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {data.restaurants.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No restaurants found
                        </p>
                      ) : (
                        data.restaurants.map((restaurant) => (
                          <div
                            key={restaurant._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                <img
                                  src={restaurant.imageUrl}
                                  alt={restaurant.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://via.placeholder.com/48";
                                  }}
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {restaurant.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {restaurant.address}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRestaurantEdit(restaurant)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleRestaurantDelete(restaurant._id)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Restaurant Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? "Edit Restaurant" : "Create New Restaurant"}
                    </h3>
                    <form
                      onSubmit={handleRestaurantSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          value={restaurantForm.title}
                          onChange={(e) =>
                            setRestaurantForm({
                              ...restaurantForm,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., Pizza Hut"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          value={restaurantForm.address}
                          onChange={(e) =>
                            setRestaurantForm({
                              ...restaurantForm,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          rows={3}
                          placeholder="Enter full address"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={restaurantForm.imageUrl}
                          onChange={(e) =>
                            setRestaurantForm({
                              ...restaurantForm,
                              imageUrl: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={restaurantForm.isOpen}
                              onChange={(e) =>
                                setRestaurantForm({
                                  ...restaurantForm,
                                  isOpen: e.target.checked,
                                })
                              }
                              className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Open
                            </span>
                          </label>
                        </div>
                      </div>
                      {restaurantForm.imageUrl && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <div className="w-32 h-32 rounded-lg overflow-hidden border">
                            <img
                              src={restaurantForm.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/128";
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {editingId
                            ? "Update Restaurant"
                            : "Create Restaurant"}
                        </button>
                        {editingId && (
                          <button
                            type="button"
                            onClick={() => {
                              setRestaurantForm({
                                title: "",
                                address: "",
                                imageUrl: "",
                                isOpen: true,
                              });
                              setEditingId(null);
                            }}
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Orders List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Orders List
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {data.orders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No orders found
                        </p>
                      ) : (
                        data.orders.map((order) => (
                          <div
                            key={order._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-gray-500" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Order #{order._id.slice(-6)}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  ₹{order.totalAmount} ·{" "}
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOrderEdit(order)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOrderDelete(order._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Order Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? "Edit Order" : "Create New Order"}
                    </h3>
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Order ID
                        </label>
                        <input
                          type="text"
                          value={orderForm._id || ""}
                          onChange={(e) =>
                            setOrderForm({ ...orderForm, _id: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Order ID"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={orderForm.status}
                          onChange={(e) =>
                            setOrderForm({
                              ...orderForm,
                              status: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="PENDING">Pending</option>
                          <option value="PREPARING">Preparing</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={orderForm.totalAmount || ""}
                          onChange={(e) =>
                            setOrderForm({
                              ...orderForm,
                              totalAmount: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., 499"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Created At
                        </label>
                        <input
                          type="datetime-local"
                          value={orderForm.createdAt || ""}
                          onChange={(e) =>
                            setOrderForm({
                              ...orderForm,
                              createdAt: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {editingId ? "Update Order" : "Create Order"}
                        </button>
                        {editingId && (
                          <button
                            type="button"
                            onClick={() => {
                              setOrderForm({
                                _id: "",
                                status: "",
                                totalAmount: "",
                                createdAt: "",
                              });
                              setEditingId(null);
                            }}
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Users List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Users List
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {data.users.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No users found
                        </p>
                      ) : (
                        data.users.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                <Users className="w-6 h-6 text-gray-500" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {user.userName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {/* <button
                                onClick={() => handleUserEdit(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button> */}
                              <button
                                onClick={() => handleUserDelete(user._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* User Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? "Edit User" : "Create New User"}
                    </h3>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Name
                        </label>
                        <input
                          type="text"
                          value={userForm.userName}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              userName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userForm.email}
                          onChange={(e) =>
                            setUserForm({ ...userForm, email: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="user@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={userForm.password}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              password: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter password"
                          required={!editingId} // only required when creating
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={userForm.phone}
                          onChange={(e) =>
                            setUserForm({ ...userForm, phone: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., 9876543210"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          value={userForm.address}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          rows={3}
                          placeholder="Enter full address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Image URL
                        </label>
                        <input
                          type="text"
                          value={userForm.profile}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              profile: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Security Answer
                        </label>
                        <input
                          type="text"
                          value={userForm.answer}
                          onChange={(e) =>
                            setUserForm({ ...userForm, answer: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Security answer"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Type
                        </label>
                        <select
                          value={userForm.userType}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              userType: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="driver">driver</option>
                          <option value="vendor">vendor</option>
                        </select>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {editingId ? "Update User" : "Create User"}
                        </button>
                        {editingId && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserForm({
                                userName: "",
                                email: "",
                                password: "",
                                address: "",
                                userType: "",
                                answer: "",
                                phone: "",
                                profile: "",
                              });
                              setEditingId(null);
                            }}
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
