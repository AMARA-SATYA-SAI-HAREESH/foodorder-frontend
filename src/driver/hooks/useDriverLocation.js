import { useState, useEffect, useCallback, useRef } from "react";
import { updateDriverLocation } from "../api/driverApi";
import { useDriver } from "../context/DriverContext";

const useDriverLocation = (options = {}) => {
  const { updateLocation } = useDriver();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [heading, setHeading] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);

  const watchId = useRef(null);
  const lastPosition = useRef(null);
  const updateInterval = useRef(null);

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 5000,
    updateIntervalMs = 30000, // Update to backend every 30 seconds
    autoStart = false,
    distanceThreshold = 50, // meters - only update if moved this far
  } = options;

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      // For production, use a geocoding service like Google Maps, Mapbox, or OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error("Error getting address:", error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Update location to backend
  const updateLocationToBackend = useCallback(
    async (position) => {
      try {
        const address = await getAddressFromCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );

        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || null,
          timestamp: position.timestamp,
        };

        // Send to backend
        await updateDriverLocation(locationData);

        // Update local context
        updateLocation(locationData);

        return locationData;
      } catch (error) {
        console.error("Error updating location to backend:", error);
        throw error;
      }
    },
    [updateLocation]
  );

  // Start tracking location
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return false;
    }

    if (watchId.current !== null) {
      console.log("Location tracking already active");
      return false;
    }

    setError(null);
    setTracking(true);

    // Get current position first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        setAccuracy(position.coords.accuracy);
        setSpeed(position.coords.speed || 0);
        setHeading(position.coords.heading || null);
        lastPosition.current = position;

        // Initial update to backend
        updateLocationToBackend(position).catch(console.error);
      },
      (error) => {
        handleLocationError(error);
        setTracking(false);
      },
      { enableHighAccuracy, timeout, maximumAge }
    );

    // Start watching position
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation(position);
        setAccuracy(position.coords.accuracy);
        setSpeed(position.coords.speed || 0);
        setHeading(position.coords.heading || null);

        // Calculate distance traveled
        if (lastPosition.current) {
          const distance = calculateDistance(
            lastPosition.current.coords.latitude,
            lastPosition.current.coords.longitude,
            position.coords.latitude,
            position.coords.longitude
          );

          if (distance >= distanceThreshold) {
            setDistanceTraveled((prev) => prev + distance);
            lastPosition.current = position;

            // Update to backend if moved significant distance
            updateLocationToBackend(position).catch(console.error);
          }
        } else {
          lastPosition.current = position;
        }
      },
      handleLocationError,
      { enableHighAccuracy, timeout, maximumAge }
    );

    // Set up periodic updates to backend
    updateInterval.current = setInterval(() => {
      if (location) {
        updateLocationToBackend(location).catch(console.error);
      }
    }, updateIntervalMs);

    return true;
  }, [
    enableHighAccuracy,
    timeout,
    maximumAge,
    updateIntervalMs,
    distanceThreshold,
    updateLocationToBackend,
  ]);

  // Stop tracking location
  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    if (updateInterval.current !== null) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }

    setTracking(false);
    console.log("Location tracking stopped");
  }, []);

  // Handle location errors
  const handleLocationError = useCallback((error) => {
    let message = "Unknown error occurred";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message =
          "Location permission denied. Please enable location services in your browser settings.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        message = "Location request timed out.";
        break;
      default:
        message = error.message;
    }

    setError(message);
    console.error("Geolocation error:", error);
  }, []);

  // Get current position once (without continuous tracking)
  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const locationData = await updateLocationToBackend(position);
            setLocation(position);
            resolve(locationData);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          handleLocationError(error);
          reject(error);
        },
        { enableHighAccuracy, timeout, maximumAge }
      );
    });
  }, [
    enableHighAccuracy,
    timeout,
    maximumAge,
    updateLocationToBackend,
    handleLocationError,
  ]);

  // Request location permission
  const requestPermission = useCallback(() => {
    if (!navigator.permissions || !navigator.permissions.query) {
      return Promise.resolve("granted"); // Assume granted for older browsers
    }

    return navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        return result.state;
      })
      .catch(() => "prompt");
  }, []);

  // Get location status
  const getLocationStatus = useCallback(() => {
    if (!navigator.geolocation) {
      return "unsupported";
    }

    if (!location) {
      return "no_data";
    }

    if (accuracy && accuracy > 100) {
      return "low_accuracy";
    }

    return "active";
  }, [location, accuracy]);

  // Format location for display
  const formatLocation = useCallback(() => {
    if (!location) return null;

    return {
      coordinates: {
        lat: location.coords.latitude.toFixed(6),
        lng: location.coords.longitude.toFixed(6),
      },
      accuracy: `${Math.round(accuracy || location.coords.accuracy)}m`,
      speed: speed ? `${(speed * 3.6).toFixed(1)} km/h` : "0 km/h",
      heading: heading ? `${Math.round(heading)}°` : "N/A",
      timestamp: new Date(location.timestamp).toLocaleTimeString(),
      distance: `${(distanceTraveled / 1000).toFixed(2)} km`,
    };
  }, [location, accuracy, speed, heading, distanceTraveled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  // Auto-start tracking if enabled
  useEffect(() => {
    if (autoStart) {
      startTracking();
    }
  }, [autoStart, startTracking]);

  return {
    // State
    location,
    error,
    tracking,
    accuracy,
    speed,
    heading,
    distanceTraveled,

    // Actions
    startTracking,
    stopTracking,
    getCurrentPosition,
    requestPermission,

    // Status
    getLocationStatus,
    formatLocation,

    // Derived data
    coordinates: location
      ? {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        }
      : null,

    isAvailable: !!navigator.geolocation,
    hasPermission: location !== null,
    isLoading: tracking && !location,
  };
};

export default useDriverLocation;
