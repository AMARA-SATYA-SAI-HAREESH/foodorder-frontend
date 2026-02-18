// src/pages/Register.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  MapPin,
  Phone,
  HelpCircle,
  KeyRound,
  Clock,
  CheckCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

const Register: React.FC = () => {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    answer: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  // Timer countdown
  // Replace your timer useEffect with this:
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [step, timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear email error when user types
    if (e.target.name === "email") setEmailError("");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOTP = async () => {
    // Validate email
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/otp/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        },
      );

      const data = await response.json();

      // ✅ Enhanced rate limiting - read Retry-After header
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const minutes = retryAfter ? Math.ceil(parseInt(retryAfter) / 60) : 15;

        toast.error(
          `⏱️ Too many OTP requests. Please try again after ${minutes} minute${minutes > 1 ? "s" : ""}.`,
        );
        return;
      }

      if (data.success) {
        setStep("otp");
        setTimer(600);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };
  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      // First verify OTP
      const verifyResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/otp/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: otpString,
          }),
        },
      );

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        toast.error(verifyData.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      // If OTP verified, proceed with registration
      const registerResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            otpVerified: true, // Add this flag
          }),
        },
      );

      const registerData = await registerResponse.json();

      if (registerData.status) {
        toast.success("Registration successful! Redirecting to login...");
        // Wait 2 seconds then redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(registerData.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Network error. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/otp/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setTimer(600); // Reset timer
        setOtp(["", "", "", "", "", ""]); // Clear OTP fields
        toast.success("New OTP sent to your email!");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Step 1: Registration Form
  if (step === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 space-y-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <UserPlus className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Join FoodHub
            </h1>
            <p className="text-gray-600 text-lg">
              Create your account to start ordering
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </label>
              <input
                name="userName"
                type="text"
                required
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 text-lg"
                placeholder="john_doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-4 border rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 text-lg ${
                  emailError ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="john@example.com"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-2">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 text-lg"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </label>
              <input
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 text-lg"
                placeholder="123 Food Street, Pattukkottai"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 text-lg"
                  placeholder="9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Security Answer
                </label>
                <input
                  name="answer"
                  type="text"
                  required
                  value={formData.answer}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 text-lg"
                  placeholder="Mother's maiden name"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendOTP}
              disabled={otpLoading}
              className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Continue with Email Verification
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-bold text-orange-600 hover:text-orange-700 underline"
              >
                Sign In →
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: OTP Verification
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 space-y-8">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
            <KeyRound className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to{" "}
            <span className="font-semibold text-orange-600">
              {formData.email}
            </span>
          </p>
        </div>

        <div className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 outline-none transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-xl">{formatTime(timer)}</span>
          </div>

          {/* Resend OTP */}
          {timer === 0 ? (
            <button
              onClick={handleResendOTP}
              disabled={otpLoading}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {otpLoading ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-center text-sm text-gray-500">
              Didn't receive OTP? Wait for timer to expire
            </p>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying & Creating Account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Verify & Complete Registration
              </span>
            )}
          </button>

          {/* Back to form */}
          <button
            onClick={() => setStep("form")}
            className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            ← Back to registration form
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
