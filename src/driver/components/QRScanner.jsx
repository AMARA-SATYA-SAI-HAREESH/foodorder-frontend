import React, { useState, useRef } from 'react';
import { QrCode, Camera, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useDriver } from '../context/DriverContext';

const QRScanner = ({ orderId, onScanSuccess, onClose }) => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const { driver } = useDriver();

  const handleScan = async (data) => {
    if (data && scanning) {
      setScanning(false);
      setCameraActive(false);
      
      try {
        console.log('📱 QR Scanned:', data.text);
        
        // Parse QR data
        let qrData;
        try {
          qrData = JSON.parse(data.text);
        } catch {
          // If not JSON, treat as simple code
          qrData = { pickupCode: data.text };
        }

        // Call verification API
        const response = await fetch(`http://localhost:8080/api/verification/${orderId}/verify-pickup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('driverToken')}`
          },
          body: JSON.stringify({
            driverId: driver._id,
            verificationCode: qrData.pickupCode || data.text,
            method: 'QR'
          })
        });

        const result = await response.json();
        
        if (result.success) {
          setSuccess(true);
          setTimeout(() => {
            onScanSuccess(result);
          }, 1500);
        } else {
          setError(result.message || 'Verification failed');
          setScanning(true);
          setCameraActive(true);
        }
      } catch (err) {
        setError('Network error. Please try again.');
        setScanning(true);
        setCameraActive(true);
        console.error('Verification error:', err);
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner error:', err);
    setError('Camera error. Please check permissions.');
  };

  const handleRetry = () => {
    setError('');
    setScanning(true);
    setCameraActive(true);
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-black/80 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QrCode className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-white font-bold">Scan QR Code</h2>
              <p className="text-gray-300 text-sm">
                Scan the QR code at restaurant to pick up order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Scanner View */}
      <div className="absolute inset-0 flex items-center justify-center">
        {cameraActive ? (
          <div className="relative w-full max-w-md aspect-square">
            {/* Scanner border */}
            <div className="absolute inset-8 border-2 border-green-500 rounded-2xl animate-pulse"></div>
            
            {/* Corner markers */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-green-500"></div>
            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-green-500"></div>
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-green-500"></div>
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-green-500"></div>
            
            {/* Instruction text */}
            <div className="absolute -bottom-16 left-0 right-0 text-center">
              <p className="text-white text-lg font-medium">
                Align QR code within frame
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Order #{orderId?.slice(-6)}
              </p>
            </div>
          </div>
        ) : success ? (
          <div className="text-center">
            <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Pickup Verified!
            </h3>
            <p className="text-gray-300">
              Order successfully picked up
            </p>
          </div>
        ) : (
          <div className="text-center p-8">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">
              Verification Failed
            </h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Manual Entry Button */}
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <button
          onClick={() => {
            // Navigate to manual entry
            onClose();
            // You'll implement this later
          }}
          className="w-full py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg font-medium"
        >
          Enter Code Manually
        </button>
      </div>
    </div>
  );
};

export default QRScanner;