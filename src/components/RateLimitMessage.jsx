// src/components/RateLimitMessage.jsx
import React from "react";
import { Clock } from "lucide-react";

const RateLimitMessage = ({ isVisible, retryAfter }) => {
  if (!isVisible) return null;

  const minutes = Math.ceil(retryAfter / 60);
  const seconds = retryAfter % 60;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg z-50 animate-slideIn">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5" />
        <div>
          <p className="font-bold">Rate Limit Exceeded</p>
          <p className="text-sm">
            Too many attempts. Please wait {minutes > 0 ? `${minutes}m ` : ""}
            {seconds > 0 ? `${seconds}s` : ""} before trying again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateLimitMessage;
