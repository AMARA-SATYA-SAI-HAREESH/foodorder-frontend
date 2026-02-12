// Category (categoryModel.js)
export interface Category {
  _id: string;
  title: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

// Restaurant (restaurantModel.js)
export interface RestaurantCoords {
  address?: string;
  latitude?: number;
  longitude?: number;
  title?: string;
}

export interface Restaurant {
  _id: string;
  title: string;
  imageUrl: string;
  logoUrl: string;
  code: string;
  deliveryPrice?: number;
  time?: string;
  pickUp: boolean;
  delivery: boolean;
  isOpen: boolean;
  rating: number;
  ratingCount: number;
  coords: RestaurantCoords;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  address: string;
  deliveryTime?: string;
}

// Food (foodModel.js)
export interface Food {
  _id: string;
  title: string;
  description: string;
  price: number;
  foodTags: string[];
  imageUrl: string;
  categoryId: string; // ref: Category
  code?: string;
  isAvailable: boolean;
  restaurantId: string; // ref: Restaurant
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

// User (userModel.js)
export type UserType = "admin" | "user" | "driver" | "vendor";

export interface User {
  _id: string;
  userName: string;
  email: string;
  password?: string; // never used on frontend except forms
  address: string;
  phone: string;
  answer?: string;
  userType: UserType;
  profile: string;
  createdAt?: string;
  updatedAt?: string;
}

// Order (orderModel.js)
export type PaymentMethod = "COD" | "CARD" | "UPI";

export interface OrderFoodItem {
  foodId: Food; // ref: foods
  quantity: number;
}

export interface OrderPayment {
  method: PaymentMethod;
  amount: number;
  transactionId: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFORMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  _id: string;
  food: OrderFoodItem[];
  payment: { method: string; amount: number; transactionId: string };
  verification?: {
    deliveryOTP?: string;
    otpExpiresAt?: string;
    otpGeneratedAt?: string;
  };
  buyer: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Cart item = Food + quantity
export interface CartItem extends Food {
  quantity: number;
}
