import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, ZoomIn, ZoomOut } from "lucide-react";

const MapView = ({ currentLocation, orders = [] }) => {
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({ lat: 28.7041, lng: 77.1025 }); // Default to Delhi

  useEffect(() => {
    if (currentLocation?.lat && currentLocation?.lng) {
      setCenter({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
    }
  }, [currentLocation]);

  useEffect(() => {
    // Initialize simple map (in a real app, use Google Maps or Mapbox)
    renderSimpleMap();
  }, [center, zoom]);

  const renderSimpleMap = () => {
    if (!mapRef.current) return;

    // Clear previous content
    mapRef.current.innerHTML = "";

    // Create a simple grid-based map (replace with real map in production)
    const mapContainer = document.createElement("div");
    mapContainer.className = "relative w-full h-full bg-gray-200 rounded-lg";
    mapContainer.style.backgroundImage =
      "radial-gradient(circle at 1px 1px, #9CA3AF 1px, transparent 0)";
    mapContainer.style.backgroundSize = "40px 40px";

    // Add driver marker
    const driverMarker = document.createElement("div");
    driverMarker.className =
      "absolute w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg";
    driverMarker.style.left = "50%";
    driverMarker.style.top = "50%";
    driverMarker.style.transform = "translate(-50%, -50%)";

    // Add navigation icon to driver marker
    const navIcon = document.createElement("div");
    navIcon.className = "flex items-center justify-center w-full h-full";
    navIcon.innerHTML = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
    </svg>`;
    driverMarker.appendChild(navIcon);

    // Add order markers
    const orderMarkers = orders
      .slice(0, 5)
      .map((order, index) => {
        if (!order.restaurantId?.location) return null;

        const angle = (index / orders.length) * 2 * Math.PI;
        const radius = 100;
        const left = 50 + radius * Math.cos(angle) + "%";
        const top = 50 + radius * Math.sin(angle) + "%";

        const marker = document.createElement("div");
        marker.className =
          "absolute w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg";
        marker.style.left = left;
        marker.style.top = top;
        marker.style.transform = "translate(-50%, -50%)";

        const markerIcon = document.createElement("div");
        markerIcon.className = "flex items-center justify-center w-full h-full";
        markerIcon.innerHTML = `<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
      </svg>`;
        marker.appendChild(markerIcon);

        // Add tooltip
        const tooltip = document.createElement("div");
        tooltip.className =
          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none";
        tooltip.textContent = `Order #${order._id?.slice(-6)}`;
        marker.appendChild(tooltip);
        marker.className += " group";

        return marker;
      })
      .filter(Boolean);

    mapContainer.appendChild(driverMarker);
    orderMarkers.forEach((marker) => mapContainer.appendChild(marker));
    mapRef.current.appendChild(mapContainer);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 8));
  };

  const handleCenterOnDriver = () => {
    if (currentLocation?.lat && currentLocation?.lng) {
      setCenter({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleCenterOnDriver}
          className="w-10 h-10 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center hover:bg-blue-700"
        >
          <Navigation className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Available Orders</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
