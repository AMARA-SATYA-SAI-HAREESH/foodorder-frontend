// src/vendor/pages/VendorRestaurant.jsx
import React, { useState, useEffect } from "react";
import {
  Store,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Image as ImageIcon,
  Globe,
  Phone,
  Mail,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useVendor } from "../context/VendorContext";
import { updateRestaurantDetails, getRestaurantStats } from "../api/vendorApi";

const VendorRestaurant = () => {
  const { restaurant, updateRestaurantData } = useVendor();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    logoUrl: "",
    time: "",
    pickUp: true,
    delivery: true,
    isOpen: true,
    coords: {
      address: "",
      latitude: "",
      longitude: "",
      title: "",
    },
  });

  useEffect(() => {
    if (restaurant) {
      setFormData({
        title: restaurant.title || "",
        imageUrl: restaurant.imageUrl || "",
        logoUrl: restaurant.logoUrl || "",
        time: restaurant.time || "10:00 AM - 11:00 PM",
        pickUp: restaurant.pickUp !== false,
        delivery: restaurant.delivery !== false,
        isOpen: restaurant.isOpen !== false,
        coords: {
          address: restaurant.coords?.address || "",
          latitude: restaurant.coords?.latitude || "",
          longitude: restaurant.coords?.longitude || "",
          title: restaurant.coords?.title || "",
        },
      });
      fetchStats();
    }
  }, [restaurant]);

  const fetchStats = async () => {
    try {
      const response = await getRestaurantStats();
      if (response.data.status) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateRestaurantDetails(formData);
      if (response.data.status) {
        updateRestaurantData(response.data.restaurant);
        setEditing(false);
        alert("Restaurant details updated successfully!");
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
      alert("Failed to update restaurant details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (type) => {
    // For demo purposes - in real app, you'd upload to cloud storage
    const url = prompt(`Enter ${type} URL:`);
    if (url) {
      if (type === "logo") {
        setFormData({ ...formData, logoUrl: url });
      } else {
        setFormData({ ...formData, imageUrl: url });
      }
    }
  };

  if (!restaurant) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Restaurant Settings
          </h1>
          <p className="text-gray-600">
            Manage your restaurant profile and settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
            <div
              className={`w-2 h-2 rounded-full ${
                restaurant.isVerified ? "bg-green-500" : "bg-yellow-500"
              }`}
            ></div>
            <span className="text-sm font-medium">
              {restaurant.isVerified ? "Verified" : "Pending Verification"}
            </span>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editing ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit Details
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalOrders || 0}
            </p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalFoods || 0}
            </p>
            <p className="text-sm text-gray-600">Menu Items</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">
              {stats.todaysOrders || 0}
            </p>
            <p className="text-sm text-gray-600">Today's Orders</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats.totalRevenue || 0}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Restaurant Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Restaurant Details Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Restaurant Information
              </h2>
              {editing && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>

            <form className="space-y-6">
              {/* Restaurant Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">
                    {restaurant.title}
                  </p>
                )}
              </div>

              {/* Operating Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Operating Hours
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10:00 AM - 11:00 PM"
                  />
                ) : (
                  <p className="text-gray-900">
                    {restaurant.time || "Not set"}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Restaurant Address
                </label>
                {editing ? (
                  <textarea
                    value={formData.coords.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coords: { ...formData.coords, address: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter full address"
                  />
                ) : (
                  <p className="text-gray-900">
                    {restaurant.coords?.address || "Address not set"}
                  </p>
                )}
              </div>

              {/* Service Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Service Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pickUp}
                      onChange={(e) =>
                        setFormData({ ...formData, pickUp: e.target.checked })
                      }
                      disabled={!editing}
                      className="w-4 h-4 text-blue-600 disabled:opacity-50"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Pickup</p>
                      <p className="text-sm text-gray-500">
                        Allow customers to pickup orders
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.delivery}
                      onChange={(e) =>
                        setFormData({ ...formData, delivery: e.target.checked })
                      }
                      disabled={!editing}
                      className="w-4 h-4 text-blue-600 disabled:opacity-50"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Delivery</p>
                      <p className="text-sm text-gray-500">
                        Offer delivery service
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Restaurant Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Restaurant Status
                </h3>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.isOpen}
                      onChange={() =>
                        setFormData({ ...formData, isOpen: true })
                      }
                      disabled={!editing}
                      className="w-4 h-4 text-green-600 disabled:opacity-50"
                    />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-900">Open</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="status"
                      checked={!formData.isOpen}
                      onChange={() =>
                        setFormData({ ...formData, isOpen: false })
                      }
                      disabled={!editing}
                      className="w-4 h-4 text-red-600 disabled:opacity-50"
                    />
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-gray-900">Closed</span>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Location Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Title
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.coords.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coords: { ...formData.coords, title: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Main Branch"
                  />
                ) : (
                  <p className="text-gray-900">
                    {restaurant.coords?.title || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coordinates
                </label>
                {editing ? (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      step="any"
                      value={formData.coords.latitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coords: {
                            ...formData.coords,
                            latitude: e.target.value,
                          },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Latitude"
                    />
                    <input
                      type="number"
                      step="any"
                      value={formData.coords.longitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coords: {
                            ...formData.coords,
                            longitude: e.target.value,
                          },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Longitude"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {restaurant.coords?.latitude && restaurant.coords?.longitude
                      ? `${restaurant.coords.latitude}, ${restaurant.coords.longitude}`
                      : "Coordinates not set"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Images and Preview */}
        <div className="space-y-6">
          {/* Restaurant Image */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Restaurant Image
            </h3>
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={
                    (editing ? formData.imageUrl : restaurant.imageUrl) ||
                    "https://via.placeholder.com/600x400"
                  }
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                />
                {editing && (
                  <button
                    onClick={() => handleImageUpload("restaurant")}
                    className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Enter image URL"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Restaurant Logo
            </h3>
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                {restaurant.logoUrl || formData.logoUrl ? (
                  <img
                    src={editing ? formData.logoUrl : restaurant.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {editing && (
                <div>
                  <button
                    onClick={() => handleImageUpload("logo")}
                    className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload New Logo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Restaurant Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verification</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    restaurant.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {restaurant.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Status</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      restaurant.isOpen ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium">
                    {restaurant.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(restaurant.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm">
                    {restaurant.rating || "5.0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Contact support for restaurant verification or any issues.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">+1 234 567 8900</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">support@foodorder.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRestaurant;
