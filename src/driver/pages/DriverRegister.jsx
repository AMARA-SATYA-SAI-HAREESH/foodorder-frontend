import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDriver } from "../context/DriverContext";
import driverApi from "../api/driverApi";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
  Car,
  Smartphone,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

const DriverRegister = () => {
  const navigate = useNavigate();
  const { register } = useDriver();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState({
    email: "",
    phone: "",
    licenseNumber: "",
    vehicleNumber: "",
  });

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "blue", // security answer
    vehicleType: "BIKE",
    vehicleNumber: "",
    licenseNumber: "",
  });

  const vehicleTypes = [
    { value: "BIKE", label: "Motorcycle", icon: "🏍️" },
    { value: "CAR", label: "Car", icon: "🚗" },
    { value: "SCOOTER", label: "Scooter", icon: "🛵" },
    { value: "BICYCLE", label: "Bicycle", icon: "🚲" },
  ];

  // Check availability
  const checkAvailability = async (field, value) => {
    if (!value) return;

    try {
      const query = new URLSearchParams();
      query.set(field, value);

      const response = await driverApi.checkAvailability(query);
      if (response.data?.success) {
        setAvailability((prev) => ({
          ...prev,
          [field]: response.data.results[field],
        }));
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Check availability for specific fields
    if (["email", "phone", "licenseNumber", "vehicleNumber"].includes(name)) {
      checkAvailability(name, value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) newErrors.userName = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.vehicleNumber)
      newErrors.vehicleNumber = "Vehicle number is required";
    if (!formData.licenseNumber)
      newErrors.licenseNumber = "License number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        navigate("/driver/dashboard");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const AvailabilityBadge = ({ field }) => {
    const status = availability[field];
    if (!status) return null;

    return (
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          status === "AVAILABLE"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {status === "AVAILABLE" ? (
          <>
            <Check className="inline w-3 h-3 mr-1" /> Available
          </>
        ) : (
          <>
            <X className="inline w-3 h-3 mr-1" /> Taken
          </>
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Become a Delivery Driver
          </h1>
          <p className="mt-2 text-gray-600">
            Join our platform and start earning today
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              {["Personal Info", "Vehicle Details", "Account Setup"].map(
                (step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="ml-2 text-sm font-medium hidden sm:inline">
                      {step}
                    </span>
                    {index < 2 && (
                      <div className="w-12 h-0.5 bg-gray-300 mx-2"></div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
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
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.userName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.userName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
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
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="mt-1">
                    <AvailabilityBadge field="email" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
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
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="9876543210"
                      maxLength="10"
                    />
                  </div>
                  <div className="mt-1">
                    <AvailabilityBadge field="phone" />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Security Question: Favorite Color? *
                  </label>
                  <input
                    type="text"
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="For password recovery"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Full address for delivery verification"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicleTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`cursor-pointer border rounded-lg p-3 text-center ${
                          formData.vehicleType === type.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="vehicleType"
                          value={type.value}
                          checked={formData.vehicleType === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="text-sm font-medium">{type.label}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number *
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
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase"
                      placeholder="AB12CD1234"
                    />
                  </div>
                  <div className="mt-1">
                    <AvailabilityBadge field="vehicleNumber" />
                  </div>
                  {errors.vehicleNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.vehicleNumber}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driving License Number *
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
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase"
                      placeholder="DL12345678901234"
                    />
                  </div>
                  <div className="mt-1">
                    <AvailabilityBadge field="licenseNumber" />
                  </div>
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Setup */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Setup
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="border-t pt-4">
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                  . I confirm that all information provided is accurate and I
                  have a valid driving license.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Driver Account"
                )}
              </button>

              <Link
                to="/driver/login"
                className="py-3 px-4 border border-gray-300 rounded-lg font-medium text-center hover:bg-gray-50"
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-blue-600 hover:text-blue-500">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;
