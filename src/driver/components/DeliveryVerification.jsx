import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Key, 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Clock,
  MapPin,
  User
} from 'lucide-react';
import { useDriver } from '../context/DriverContext';

const DeliveryVerification = ({ order, onSuccess, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes for delivery
  const inputRefs = useRef([]);
  const { driver } = useDriver();

  // Timer for delivery
  useEffect(() => {
    if (timeLeft > 0 && !success) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, success]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit if all digits entered
    if (newOtp.every(digit => digit !== '') && index === 3) {
      handleVerifyDelivery();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[3]?.focus();
    }
  };

  const handleVerifyDelivery = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter 4-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:8080/api/verification/${order._id}/verify-delivery`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('driverToken')}`,
          },
          body: JSON.stringify({
            driverId: driver._id,
            otp: otpString,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(result);
        }, 2000);
      } else {
        setError(result.message || 'Invalid OTP');
        // Clear OTP on error
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Delivery verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Delivery Complete!
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Order successfully delivered to customer
        </p>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 w-full max-w-md shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Delivery Summary</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">#{order._id?.slice(-6)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Customer</span>
              <span className="font-medium">{order.buyer?.userName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium">₹{order.payment?.amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment</span>
              <span className="font-medium">{order.payment?.method}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              Thank you for the delivery!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Verify Delivery</h1>
        <div className="w-10"></div>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-amber-600" />
        <span className="text-amber-700 font-medium">
          Time: {formatTime(timeLeft)}
        </span>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Delivery Details</h3>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            #{order._id?.slice(-6)}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="text-gray-900">{order.deliveryAddress}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-gray-900">{order.buyer?.userName}</p>
              <p className="text-gray-600 text-sm">{order.buyer?.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              Ask customer for OTP
            </p>
            <p className="text-sm text-blue-700">
              The customer should have received a 4-digit OTP on their registered phone number.
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
        
        <p className="text-center text-gray-500 text-sm">
          Enter the OTP provided by customer
        </p>
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
        onClick={handleVerifyDelivery}
        disabled={loading || otp.join('').length !== 4}
        className={`w-full py-4 rounded-xl font-bold text-lg mb-4 ${
          loading || otp.join('').length !== 4
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Verifying...
          </div>
        ) : (
          'Complete Delivery'
        )}
      </button>

      {/* COD Payment Notice */}
      {order.payment?.method === 'COD' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800 font-medium mb-1">
            💵 Cash on Delivery
          </p>
          <p className="text-sm text-amber-700">
            Collect ₹{order.payment?.amount} from customer before completing delivery.
          </p>
        </div>
      )}

      {/* Manual Fallback */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            // Show manual verification options
            alert('Contact customer for OTP or call support');
          }}
          className="text-blue-600 text-sm hover:text-blue-700"
        >
          Having trouble? Get help
        </button>
      </div>
    </div>
  );
};

export default DeliveryVerification;