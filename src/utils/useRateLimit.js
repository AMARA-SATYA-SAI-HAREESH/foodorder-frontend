// src/hooks/useRateLimit.js
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const useRateLimit = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  useEffect(() => {
    const handleRateLimit = (event) => {
      setIsRateLimited(true);

      // Extract retry time from error message or default to 15 minutes
      const message = event.detail?.message || "";
      const match = message.match(/(\d+)\s*minutes?/);
      const minutes = match ? parseInt(match[1]) : 15;

      setRetryAfter(minutes * 60); // Convert to seconds

      toast.error(
        `⏱️ Too many attempts. Please try again after ${minutes} minutes.`,
      );

      // Auto-clear after retry time
      setTimeout(
        () => {
          setIsRateLimited(false);
          setRetryAfter(0);
        },
        minutes * 60 * 1000,
      );
    };

    window.addEventListener("rate-limited", handleRateLimit);

    return () => {
      window.removeEventListener("rate-limited", handleRateLimit);
    };
  }, []);

  return { isRateLimited, retryAfter };
};
