// src/vendor/pages/VendorRegister.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Store,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Image,
  X,
  Search,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { vendorRegister } from "../api/vendorApi";
// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});
const VendorRegister = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    answer: "",
    restaurantName: "",
    imageUrl: "", // ✅ ADD THIS
    latitude: "", // ✅ ADD THIS
    longitude: "", // ✅ ADD THIS
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await vendorRegister(formData);

      if (response.data.status) {
        setSuccess(response.data.message);
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/vendor/login");
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you would upload to your server/cloudinary
      // For now, create a local preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  // Handle location selection from map
  const handleLocationSelect = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
    setShowMap(false);
  };
  // Map Picker Component
  const LocationPickerModal = ({ onClose, onSelect }) => {
    const [position, setPosition] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const provider = new OpenStreetMapProvider();

    // Handle map clicks
    const LocationMarker = () => {
      useMapEvents({
        click(e) {
          setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
      });
      return position ? (
        <Marker position={[position.lat, position.lng]} />
      ) : null;
    };

    // Handle search
    const handleSearch = async (e) => {
      const value = e.target.value;
      setSearchText(value);

      if (value.length > 2) {
        const results = await provider.search({ query: value });
        setSuggestions(
          results.map((r) => ({
            label: r.label,
            lat: r.y,
            lng: r.x,
          })),
        );
      } else {
        setSuggestions([]);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Select Restaurant Location
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search for location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                {suggestions.map((s, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setPosition({ lat: s.lat, lng: s.lng });
                      setSearchText(s.label);
                      setSuggestions([]);
                    }}
                    className="p-2 hover:bg-green-50 cursor-pointer border-b"
                  >
                    <p className="text-sm text-gray-700">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="p-4">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
          </div>

          {/* Selected Location */}
          {position && (
            <div className="px-4 pb-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-2">
                  Selected:
                </p>
                <p className="text-xs">Lat: {position.lat.toFixed(6)}</p>
                <p className="text-xs">Lng: {position.lng.toFixed(6)}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="p-4 border-t flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2 border rounded-lg">
              Cancel
            </button>
            <button
              onClick={() => {
                if (position) {
                  onSelect(position.lat, position.lng);
                  onClose();
                } else {
                  alert("Please select a location");
                }
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
            <Store className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register as Vendor
          </h1>
          <p className="text-gray-600">Start selling your food online</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
            <p className="text-green-600 text-sm mt-1">
              Redirecting to login page...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Vendor Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Restaurant Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name
                </label>
                <div className="relative">
                  <Store
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={formData.restaurantName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        restaurantName: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Pizza Palace"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="vendor@example.com"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Security Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Question
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  What's your favorite food? (For password recovery)
                </p>
                <input
                  type="text"
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Pizza"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Full restaurant address with city, state, and PIN code"
                    required
                  />
                </div>
              </div>
              {/* Restaurant Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="restaurant-image"
                  />
                  <label
                    htmlFor="restaurant-image"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Image className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 mb-1">
                      Click to upload restaurant image
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG up to 5MB
                    </span>
                  </label>
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Location Picker */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Location
                </label>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <MapPin className="w-5 h-5 text-green-600" />
                  {formData.latitude && formData.longitude
                    ? "📍 Location Selected"
                    : "📍 Pick Location on Map"}
                </button>

                {/* Selected Location Display */}
                {formData.latitude && formData.longitude && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Latitude:</span>{" "}
                      {formData.latitude}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Longitude:</span>{" "}
                      {formData.longitude}
                    </p>
                  </div>
                )}
              </div>
              {/* Map Modal */}
              {showMap && (
                <LocationPickerModal
                  onClose={() => setShowMap(false)}
                  onSelect={handleLocationSelect}
                />
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-green-600 focus:ring-green-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-green-600 hover:text-green-700"
                >
                  Terms & Conditions
                </Link>{" "}
                and understand that my restaurant needs admin verification
                before going live.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Registering..." : "Create Vendor Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/vendor/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Back to Main Site */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to main website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;
