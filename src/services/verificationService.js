import api from "./api";

export const verificationService = {
  // Generate QR data for order
  async generateQRData(orderId) {
    try {
      const response = await api.get(`/verification/${orderId}/qr-data`);
      return response.data;
    } catch (error) {
      console.error("Error generating QR data:", error);
      throw error;
    }
  },

  // Get verification details
  async getVerificationDetails(orderId) {
    try {
      const response = await api.get(`/verification/${orderId}/details`);
      return response.data;
    } catch (error) {
      console.error("Error getting verification details:", error);
      throw error;
    }
  },

  // Verify pickup (for driver)
  async verifyPickup(orderId, driverId, verificationCode, method = "QR") {
    try {
      const response = await api.post(
        `/verification/${orderId}/verify-pickup`,
        {
          driverId,
          verificationCode,
          method,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error verifying pickup:", error);
      throw error;
    }
  },

  // Verify delivery (for driver)
  async verifyDelivery(orderId, driverId, otp) {
    try {
      const response = await api.post(
        `/verification/${orderId}/verify-delivery`,
        {
          driverId,
          otp,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error verifying delivery:", error);
      throw error;
    }
  },

  // Manual verification (fallback)
  async manualVerification(orderId, driverId, orderNumber) {
    try {
      const response = await api.post(
        `/verification/${orderId}/manual-verify`,
        {
          driverId,
          orderNumber,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error manual verification:", error);
      throw error;
    }
  },

  // Refresh verification codes (for vendor)
  async refreshVerificationCodes(orderId) {
    try {
      const response = await api.post(`/verification/${orderId}/refresh-codes`);
      return response.data;
    } catch (error) {
      console.error("Error refreshing codes:", error);
      throw error;
    }
  },

  // Socket events for verification
  setupVerificationListeners(socket, callbacks) {
    if (!socket) return;

    // Listen for verification events
    socket.on("verification-generated", (data) => {
      callbacks.onVerificationGenerated?.(data);
    });

    socket.on("pickup-verified", (data) => {
      callbacks.onPickupVerified?.(data);
    });

    socket.on("delivery-verified", (data) => {
      callbacks.onDeliveryVerified?.(data);
    });

    socket.on("verification-failed", (data) => {
      callbacks.onVerificationFailed?.(data);
    });

    socket.on("qr-expired", (data) => {
      callbacks.onQRExpired?.(data);
    });
  },

  // Remove verification listeners
  removeVerificationListeners(socket) {
    if (!socket) return;

    socket.off("verification-generated");
    socket.off("pickup-verified");
    socket.off("delivery-verified");
    socket.off("verification-failed");
    socket.off("qr-expired");
  },
};

export default verificationService;
