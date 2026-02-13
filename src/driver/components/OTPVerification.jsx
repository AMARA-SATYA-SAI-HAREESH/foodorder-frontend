import React, { useState, useRef } from "react";
import {
  Smartphone,
  Key,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const OTPVerification = ({ order, onSuccess, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const inputRefs = useRef([]);

  // Timer countdown
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if last digit
    if (index === 3 && value) {
      const otpString = newOtp.join("");
      if (otpString.length === 4) {
        handleVerifyOTP();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d{4}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      inputRefs.current[3]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      setError("Please enter 4-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const driverData = JSON.parse(localStorage.getItem("driver") || "{}");
      const driverId = driverData._id || driverData.id;

      const response = await fetch(
        // `http://localhost:8080/api/otp/${order._id || order.id}/verify`,
        `${process.env.REACT_APP_API_URL}/api/otp/${order._id || order.id}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
          },
          body: JSON.stringify({
            otp: otpString,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        onSuccess(result);
      } else {
        setError(result.message || "Invalid OTP");
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("Network error. Try again.");
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Verify Delivery</h1>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <span className="text-amber-700 font-medium">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              Ask customer for OTP
            </p>
            <p className="text-sm text-blue-700">
              Customer should have received a 4-digit OTP on their phone. Enter
              it below to complete delivery.
            </p>
          </div>
        </div>
      </div>

      {/* OTP Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
          Enter 4-digit OTP
        </label>

        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              autoFocus={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Verify Button */}
      <button
        onClick={handleVerifyOTP}
        disabled={loading || otp.join("").length !== 4}
        className={`w-full py-4 rounded-xl font-bold text-lg mb-4 ${
          loading || otp.join("").length !== 4
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Verifying...
          </div>
        ) : (
          "Complete Delivery"
        )}
      </button>

      {/* Help Text */}
      <p className="text-center text-gray-500 text-sm">
        OTP is sent to customer's registered phone number via app notification
      </p>
    </div>
  );
};

export default OTPVerification;
