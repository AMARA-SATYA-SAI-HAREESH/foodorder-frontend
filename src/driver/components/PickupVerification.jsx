import React, { useState } from "react";
import {
  QrCode,
  Key,
  ArrowLeft,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { useDriver } from "../context/DriverContext";

const PickupVerification = ({ order, onSuccess, onBack }) => {
  // ✅ Move useDriver to component top level
  const { driver } = useDriver();

  const [verificationMethod, setVerificationMethod] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get driver ID from context
  const driverId = driver?._id || driver?.id;

  // Function to open Google Lens
  const openGoogleLens = () => {
    window.open(
      "https://lens.google.com/search",
      "_blank",
      "noopener,noreferrer",
    );

    setTimeout(() => {
      const scannedCode = prompt(
        "📱 Google Lens Opened!\n\n" +
          "1. Use Google Lens to scan the QR code\n" +
          "2. Copy the scanned text/numbers\n" +
          "3. Paste it below:\n\n" +
          "Or enter the code manually:",
        verificationCode || "",
      );

      if (scannedCode && scannedCode.trim()) {
        setVerificationCode(scannedCode.trim());
      }
    }, 1500);
  };

  const handleVerifyPickup = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter verification code");
      return;
    }

    if (!driverId) {
      setError("Driver not found. Please login again.");
      return;
    }

    if (!order || (!order._id && !order.id)) {
      setError("Order information is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderId = order._id || order.id;
      console.log("🔍 [FRONTEND] Verifying pickup for order:", orderId);

      const response = await fetch(
        // `http://localhost:8080/api/verification/${orderId}/verify-pickup`,
        `${process.env.REACT_APP_API_URL}/api/verification/${orderId}/verify-pickup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
          },
          body: JSON.stringify({
            driverId: driverId,
            verificationCode: verificationCode.trim(),
            method: verificationMethod === "qr" ? "QR" : "MANUAL",
          }),
        },
      );

      const result = await response.json();
      console.log("🔍 [FRONTEND] Backend response:", result);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(result);
        }, 2000);
      } else {
        if (result.codeMatched) {
          setError(`✅ Codes matched! But: ${result.message}`);
        } else {
          setError(result.message || "Verification failed");
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains exactly the same...
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pickup Verified!
        </h2>
        <p className="text-gray-600 mb-8">
          Order successfully picked up from restaurant
        </p>
      </div>
    );
  }

  if (!verificationMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Verify Pickup</h1>
          <div className="w-10"></div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Order Details</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              #{(order._id || order.id)?.slice(-6)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Restaurant: {order.restaurantId?.name}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Choose verification method:
          </h2>

          <button
            onClick={() => {
              setVerificationMethod("qr");
              openGoogleLens();
            }}
            className="w-full p-4 bg-white border-2 border-blue-500 rounded-xl flex items-center gap-4 hover:bg-blue-50 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Scan QR Code</h3>
                <ExternalLink className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">
                Opens Google Lens to scan QR code
              </p>
            </div>
          </button>

          <button
            onClick={() => setVerificationMethod("manual")}
            className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Key className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Enter Code Manually</h3>
              <p className="text-sm text-gray-600">
                Enter the pickup code provided by restaurant
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setVerificationMethod(null)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">
          {verificationMethod === "qr" ? "Scan QR Code" : "Enter Pickup Code"}
        </h1>
        <div className="w-10"></div>
      </div>

      {verificationMethod === "qr" && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <QrCode className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  📱 Google Lens Instructions:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Google Lens opened in a new tab</li>
                  <li>• Point camera at restaurant's QR code</li>
                  <li>• Copy the scanned text/numbers</li>
                  <li>• Paste in the field below</li>
                </ul>
              </div>
            </div>

            <button
              onClick={openGoogleLens}
              className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Re-open Google Lens
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {verificationMethod === "qr" ? "Scanned Code" : "Pickup Code"}
        </label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder={
            verificationMethod === "qr"
              ? "Paste the code scanned from Google Lens..."
              : "e.g., PICKUP-A1B2C3"
          }
          className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-lg"
          autoFocus
        />
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleVerifyPickup}
        disabled={loading || !verificationCode.trim()}
        className={`w-full py-4 rounded-xl font-bold text-lg ${
          loading || !verificationCode.trim()
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Verifying...
          </div>
        ) : (
          "Verify Pickup"
        )}
      </button>
    </div>
  );
};

export default PickupVerification;
