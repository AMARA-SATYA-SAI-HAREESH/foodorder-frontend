import React, { useState, useEffect } from "react";
import {
  X,
  QrCode,
  Copy,
  RefreshCw,
  CheckCircle,
  Clock,
  User,
  Package,
  DollarSign,
  Smartphone,
  AlertCircle,
  Share2,
  Printer,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const QRVerificationModal = ({ order, isOpen, onClose }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [driverStatus, setDriverStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  // REMOVED: const { socket } = useSocket();

  useEffect(() => {
    if (isOpen && order) {
      fetchQRData();
      startTimer();
      // REMOVED: setupSocketListeners();
    }

    return () => {
      // REMOVED socket cleanup
    };
  }, [isOpen, order]);

  useEffect(() => {
    if (timeLeft > 0 && isOpen) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isOpen]);

  // const fetchQRData = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     // ✅ CORRECT: Fetch actual verification codes from order
  //     console.log("🔍 Fetching verification codes for order:", order._id);

  //     // The order object already has verification codes from backend
  //     // Check if they exist
  //     if (!order.verification?.pickupCode || !order.verification?.deliveryOTP) {
  //       setError("Verification codes not generated yet. Please refresh.");
  //       return;
  //     }

  //     // ✅ Use ACTUAL codes from backend
  //     const qrData = {
  //       success: true,
  //       qrString: JSON.stringify({
  //         orderId: order._id,
  //         pickupCode: order.verification.pickupCode,
  //         restaurantId: order.restaurantId?._id,
  //         type: "PICKUP_VERIFICATION",
  //         timestamp: new Date().toISOString(),
  //       }),
  //       verification: {
  //         pickupCode: order.verification.pickupCode,
  //         deliveryOTP: order.verification.deliveryOTP,
  //         expiresAt: order.verification.qrGeneratedAt
  //           ? new Date(
  //               new Date(order.verification.qrGeneratedAt).getTime() +
  //                 2 * 60 * 60 * 1000
  //             ) // 2 hours
  //           : new Date(Date.now() + 30 * 60 * 1000), // 30 minutes fallback
  //       },
  //     };

  //     setQrData(qrData);
  //     setTimeLeft(120);

  //     console.log("✅ QR Data loaded:", {
  //       pickupCode: order.verification.pickupCode,
  //       deliveryOTP: order.verification.deliveryOTP,
  //       qrGeneratedAt: order.verification.qrGeneratedAt,
  //     });
  //   } catch (err) {
  //     setError("Error loading verification codes");
  //     console.error("QR fetch error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const fetchQRData = async () => {
  try {
    setLoading(true);
    setError("");

    console.log("🔍 [QR] Order verification data:", order.verification);

    if (!order.verification?.pickupCode) {
      setError("Verification codes not available. Please refresh.");
      return;
    }

    // ✅ Use ACTUAL codes from backend
    const qrData = {
      success: true,
      qrString: JSON.stringify({
        orderId: order._id,
        pickupCode: order.verification.pickupCode,
        restaurantId: order.restaurantId?._id,
        type: "PICKUP_VERIFICATION",
        timestamp: new Date().toISOString()
      }),
      verification: {
        pickupCode: order.verification.pickupCode,
        deliveryOTP: order.verification.deliveryOTP,
        expiresAt: order.verification.qrGeneratedAt 
          ? new Date(new Date(order.verification.qrGeneratedAt).getTime() + 2 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 60 * 1000),
      },
    };

    setQrData(qrData);
    setTimeLeft(120);
    
    console.log("✅ [QR] QR Data loaded:", qrData.verification);
  } catch (err) {
    setError("Error loading verification codes");
    console.error("QR fetch error:", err);
  } finally {
    setLoading(false);
  }
};
  // REMOVED: setupSocketListeners function

  const startTimer = () => {
    setTimeLeft(120); // 2 minutes
  };

  const handleRefreshQR = async () => {
    await fetchQRData();
    setSuccess("QR code refreshed!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share && qrData) {
      try {
        await navigator.share({
          title: `Order ${order._id.slice(-6)} - Pickup Details`,
          text: `Pickup Code: ${qrData.verification.pickupCode}\nOrder ID: ${order._id}`,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order ${order._id.slice(-6)} - Pickup QR</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            .qr-container { margin: 20px auto; }
            .info { margin: 10px 0; }
            .code { font-size: 18px; font-weight: bold; margin: 10px; }
          </style>
        </head>
        <body>
          <h2>Order Pickup Verification</h2>
          <div class="info">Order: ${order._id.slice(-6)}</div>
          <div class="info">Customer: ${
            order.buyer?.userName || "Customer"
          }</div>
          <div class="qr-container">
            <div style="width: 200px; height: 200px; border: 2px dashed #ccc; margin: 0 auto;">
              QR Code Placeholder
            </div>
          </div>
          <div class="code">Pickup Code: ${
            qrData?.verification.pickupCode || ""
          }</div>
          <div class="code">Delivery OTP: ${
            qrData?.verification.deliveryOTP || ""
          }</div>
          <p>Generated at: ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get QR size based on screen width
  const getQRSize = () => {
    const width = window.innerWidth;
    if (width < 640) return 200; // Mobile
    if (width < 1024) return 180; // Tablet
    return 160; // Desktop
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Responsive positioning */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Order Verification
                </h2>
                <p className="text-sm text-gray-600">
                  Order #{order._id.slice(-6)} •{" "}
                  {order.buyer?.userName || "Customer"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Generating QR code...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-900 font-medium mb-2">
                  Error loading QR
                </p>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchQRData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : qrData ? (
              <div className="space-y-6">
                {/* QR Code Display - Responsive */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-xl border border-blue-200">
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* QR Code */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="p-4 bg-white rounded-xl shadow-inner">
                          <QRCodeSVG
                            id="qr-code-svg"
                            value={qrData.qrString}
                            size={getQRSize()}
                            level="H"
                            includeMargin={true}
                            className="mx-auto"
                          />
                        </div>
                        {/* Timer */}
                        <div className="absolute -top-2 -right-2">
                          <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {formatTime(timeLeft)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-3">
                        Order Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Customer</p>
                            <p className="font-medium">
                              {order.buyer?.userName || "Customer"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Package className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Items</p>
                            <p className="font-medium">
                              {order.food?.length || 0} items
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="font-medium">
                              ₹{order.payment?.amount || 0}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Smartphone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-medium">
                              {order.buyer?.phone || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Verification Codes */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pickup Code
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-lg font-bold">
                              {qrData.verification.pickupCode}
                            </div>
                            <button
                              onClick={() =>
                                handleCopyCode(qrData.verification.pickupCode)
                              }
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              {copied ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery OTP
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-lg font-bold">
                              {qrData.verification.deliveryOTP}
                            </div>
                            <button
                              onClick={() =>
                                handleCopyCode(qrData.verification.deliveryOTP)
                              }
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              {copied ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Instructions:</span> Show
                      this QR code to the delivery driver for scanning. The
                      driver will also need the Delivery OTP to complete the
                      delivery.
                    </p>
                  </div>
                </div>

                {/* Driver Status - REMOVED or keep as static if needed */}
                {/* {driverStatus && (...)} */}

                {/* Success Message */}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-800">{success}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer - Action Buttons */}
          <div className="border-t p-4 md:p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Mobile: Stack buttons vertically */}
              <div className="grid grid-cols-2 sm:flex gap-3">
                <button
                  onClick={handleRefreshQR}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh QR</span>
                  <span className="sm:hidden">Refresh</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share Details</span>
                  <span className="sm:hidden">Share</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                  <span className="sm:hidden">Print</span>
                </button>
              </div>

              {/* Desktop: Done button on right */}
              <button
                onClick={onClose}
                className="sm:ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRVerificationModal;
