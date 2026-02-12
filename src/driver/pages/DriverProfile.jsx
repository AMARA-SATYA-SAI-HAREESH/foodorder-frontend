import React, { useState, useEffect } from "react";
import { useDriver } from "../context/DriverContext";
import driverApi from "../api/driverApi";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Car,
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  Camera,
  Upload,
} from "lucide-react";

const DriverProfile = () => {
  const { driver, fetchDriverProfile } = useDriver();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    address: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        userName: driver.user?.userName || "",
        email: driver.user?.email || "",
        phone: driver.user?.phone || "",
        address: driver.user?.address || "",
        vehicleType: driver.vehicleType || "",
        vehicleNumber: driver.vehicleNumber || "",
        licenseNumber: driver.licenseNumber || "",
      });
    }
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement profile update API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setEditing(false);
    fetchDriverProfile();
  };

  const getVerificationStatus = () => {
    if (!driver) return null;

    const statusConfig = {
      APPROVED: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Verified",
      },
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Shield className="w-4 h-4" />,
        label: "Pending",
      },
      UNDER_REVIEW: {
        color: "bg-blue-100 text-blue-800",
        icon: <Shield className="w-4 h-4" />,
        label: "Under Review",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="w-4 h-4" />,
        label: "Rejected",
      },
    };

    const config =
      statusConfig[driver.verificationStatus] || statusConfig.PENDING;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (!driver) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your driver profile and settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{driver.user?.userName}</h2>
                <p className="text-blue-100">
                  {driver.vehicleNumber} • {driver.vehicleType}
                </p>
              </div>
            </div>
            <div className="text-right">
              {getVerificationStatus()}
              <p className="text-blue-100 mt-2">
                Driver since {new Date(driver.createdAt).getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              {editing ? (
                <>
                  <XCircle className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!editing}
                      rows="3"
                      className={`pl-10 w-full px-3 py-2 border rounded-lg ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg appearance-none ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    >
                      <option value="BIKE">Motorcycle</option>
                      <option value="CAR">Car</option>
                      <option value="SCOOTER">Scooter</option>
                      <option value="BICYCLE">Bicycle</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg uppercase ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg uppercase ${
                        editing
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-transparent bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                {/* Documents Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documents
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled={!editing}
                      className={`w-full px-3 py-2 border rounded-lg flex items-center justify-center gap-2 ${
                        editing
                          ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                          : "border-transparent bg-gray-50 text-gray-400"
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Driving License
                    </button>
                    <button
                      type="button"
                      disabled={!editing}
                      className={`w-full px-3 py-2 border rounded-lg flex items-center justify-center gap-2 ${
                        editing
                          ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                          : "border-transparent bg-gray-50 text-gray-400"
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload RC Book
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {editing && (
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Total Deliveries</p>
          <p className="text-2xl font-bold text-gray-900">
            {driver.totalDeliveries || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Rating</p>
          <p className="text-2xl font-bold text-gray-900">
            {driver.rating || 0}/5
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{driver.totalEarnings || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{driver.availableBalance || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
