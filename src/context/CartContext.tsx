// src/context/CartContext.tsx - FIXED VERSION
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Food, CartItem, Order } from "../types";
import api from "../services/api";
import { useAuth } from "./AuthContext";

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  loading: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Food }
  | { type: "UPDATE_QUANTITY"; payload: { foodId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "LOADING"; payload: boolean };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: action.payload };

    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };

    case "UPDATE_QUANTITY":
      const updatedItems = state.items
        .map((item) =>
          item._id === action.payload.foodId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter(
        (item) => item._id !== action.payload
      );
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: filteredItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };

    case "CLEAR_CART":
      return initialState;

    case "SET_CART":
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        totalAmount: action.payload.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };

    default:
      return state;
  }
};

// Define OrderData interface
interface OrderData {
  food: Array<{
    foodId: string;
    quantity: number;
  }>;
  payment: {
    method: string;
    amount: number;
    transactionId?: string;
    razorpayOrderId?: string;
    status: string;
  };
  address: string;
  phone: string;
  status: string;
  totalAmount: number;
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (food: Food) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  createOrder: () => Promise<Order | null>;
  createRazorpayOrder: (orderData: any) => Promise<Order | null>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, token } = useAuth();

  // Persist cart to localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart) as CartItem[];
        dispatch({ type: "SET_CART", payload: cartItems });
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (food: Food) => {
    console.log("Adding to cart:", food);
    dispatch({ type: "ADD_ITEM", payload: food });
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { foodId, quantity } });
  };

  const removeFromCart = (foodId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: foodId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("cart");
  };

  // Create Razorpay order function (moved inside the component)
  const createRazorpayOrder = async (orderData: any): Promise<Order | null> => {
    try {
      if (!token) {
        alert("Please login to place an order.");
        return null;
      }

      // Use the provided orderData for Razorpay
      const response = await api.post("/api/order/create-order", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.order) {
        clearCart();
        return response.data.order;
      }
      return null;
    } catch (error: any) {
      console.error("Razorpay order creation error:", error);
      alert(error.response?.data?.message || "Order failed");
      return null;
    }
  };

  // Original createOrder function (for COD)
  const createOrder = async (): Promise<Order | null> => {
    console.log("🛒 Starting order creation process");

    try {
      // 1. Check authentication
      if (!token) {
        console.error("❌ No authentication token");
        alert("Please login to place an order.");
        return null;
      }

      if (!user?._id) {
        console.error("❌ User ID not available");
        alert("User information missing. Please login again.");
        return null;
      }

      // 2. Check cart items
      if (state.items.length === 0) {
        console.error("❌ Cart is empty");
        alert("Your cart is empty. Add items first.");
        return null;
      }

      // 3. Validate cart items
      console.log(
        "📦 Cart items:",
        state.items.map((item) => ({
          id: item._id,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          restaurantId: item.restaurantId,
          hasRestaurantId: !!item.restaurantId,
        }))
      );

      // Check for missing restaurantId
      const invalidItems = state.items.filter((item) => !item.restaurantId);
      if (invalidItems.length > 0) {
        console.error("❌ Items missing restaurantId:", invalidItems);
        alert(
          "Some items are missing restaurant information. Please remove and re-add them."
        );
        return null;
      }

      // Check for multiple restaurants
      const restaurantIds: string[] = [];
      state.items.forEach((item) => {
        if (item.restaurantId && !restaurantIds.includes(item.restaurantId)) {
          restaurantIds.push(item.restaurantId);
        }
      });

      if (restaurantIds.length > 1) {
        console.error("❌ Multiple restaurants in cart:", restaurantIds);
        alert(
          "Cannot order from multiple restaurants at once. Please order from one restaurant at a time."
        );
        return null;
      }

      const restaurantId = restaurantIds[0];
      console.log("✅ Restaurant ID:", restaurantId);

      // 4. Prepare order data
      const orderData = {
        food: state.items.map((item) => ({
          foodId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        restaurantId: restaurantId,
        buyer: user._id,
        payment: {
          amount: state.totalAmount,
          method: "COD",
          status: "PENDING",
        },
        status: "PENDING",
        totalAmount: state.totalAmount,
        deliveryAddress: user.address || "Address not specified",
      };

      console.log("📤 Order data being sent:", orderData);

      // 5. Make API call
      dispatch({ type: "LOADING", payload: true });

      const response = await api.post("/api/order/create-order", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ API Response:", response.data);

      // 6. Handle response
      if (response.data && response.data.status === false) {
        console.error("❌ Backend error:", response.data.message);
        alert(`Order failed: ${response.data.message || "Unknown error"}`);
        dispatch({ type: "LOADING", payload: false });
        return null;
      }

      if (!response.data || !response.data.order) {
        console.error("❌ No order in response");
        alert("Order created but no confirmation received.");
        dispatch({ type: "LOADING", payload: false });
        return null;
      }

      // 7. Success
      console.log(
        "🎉 Order created successfully! Order ID:",
        response.data.order._id
      );

      // Clear cart
      clearCart();

      // Show success message
      alert(
        `Order #${
          response.data.order._id?.slice(-6) || ""
        } placed successfully!`
      );

      dispatch({ type: "LOADING", payload: false });
      return response.data.order;
    } catch (error: any) {
      console.error("💥 Order creation error:", error);
      dispatch({ type: "LOADING", payload: false });

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data ||
          `Server error: ${error.response.status}`;

        alert(`Order failed: ${errorMessage}`);
      } else if (error.request) {
        console.error("No response:", error.request);
        alert("No response from server. Check your connection.");
      } else {
        console.error("Request error:", error.message);
        alert(`Request failed: ${error.message}`);
      }

      return null;
    }
  };

  const value: CartContextType = {
    state,
    dispatch,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    createRazorpayOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
