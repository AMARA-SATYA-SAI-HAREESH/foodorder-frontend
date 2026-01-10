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
        .filter((item) => item.quantity > 0); // Remove if quantity 0

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

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (food: Food) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  createOrder: () => Promise<Order | null>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  // const { auth } = useAuth();
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

  const createOrder = async () => {
    if (!token || state.items.length === 0) return null;

    dispatch({ type: "LOADING", payload: true });

    try {
      const orderData = {
        food: state.items.map((item) => ({
          foodId: item._id,
          quantity: item.quantity,
        })),
        payment: {
          method: "UPI" as const, // Your enum
          amount: state.totalAmount,
          transactionId: `TXN_${Date.now()}`, // Mock - replace with real payment
        },
        buyer: user?._id || "", // From your JWT user
      };

      const response = await api.post("/api/order/create-order", orderData);

      // ✅ Replace entire createOrder function end:
      if (response.data.status === true) {
        // ✅ Check backend response
        clearCart();
        return response.data.order as Order;
      }

      return null;
    } catch (error) {
      console.error("Order creation failed:", error);
      return null;
    } finally {
      dispatch({ type: "LOADING", payload: false });
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
