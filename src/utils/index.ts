import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind className helper (used everywhere)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price (₹)
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Format rating (4.5 → 4.5⭐)
export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)}⭐`;
};

// Truncate text
export const truncate = (text: string, length: number): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

// Check if ObjectId (MongoDB)
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Calculate discount (if needed later)
export const calculateDiscount = (
  originalPrice: number,
  discountPercent: number
): number => {
  return originalPrice * (discountPercent / 100);
};

// Payment method icon
export const getPaymentIcon = (method: string) => {
  switch (method) {
    case "UPI":
      return "💳";
    case "CARD":
      return "💳";
    case "COD":
      return "💰";
    default:
      return "💳";
  }
};

// Status badge class
export const getStatusVariant = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "PREPARING":
    case "OUT_FOR_DELIVERY":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "PENDING":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    case "CONFORMED":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Generate transaction ID (mock for testing)
export const generateTransactionId = (): string => {
  return `TXN_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)
    .toUpperCase()}`;
};

// Validate form data
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Toast notifications helper (if using react-hot-toast)
export const showToast = (
  message: string,
  type: "success" | "error" | "info" = "info"
) => {
  if (typeof window !== "undefined") {
    const toast = (window as any).toast;
    if (toast) {
      toast(message, { type });
    }
  }
};

// Debounce function (search/filter)
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: number;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
};
