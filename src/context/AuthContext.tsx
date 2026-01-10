import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

// interface AuthContextType {
//   auth: AuthState;
//   token: string | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (userData: {
//     userName: string;
//     email: string;
//     password: string;
//     address: string;
//     phone: string;
//     answer: string;
//   }) => Promise<boolean>;
//   user: User | null;
//   logout: () => void;
//   updatePassword: (
//     oldPassword: string,
//     newPassword: string
//   ) => Promise<boolean>;
// }
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userName: string,
    email: string,
    password: string,
    address: string,
    phone: string,
    answer: string
  ) => Promise<boolean>;
  logout: () => void;
  updatePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setAuth({
        user: JSON.parse(user),
        token,
        loading: false,
      });
    } else {
      setAuth((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const saveAuth = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuth({ user: userData, token, loading: false });
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: null, loading: false });
  };

  //   const login = async (email: string, password: string): Promise<boolean> => {
  //     try {
  //       const response = await api.post('/user/login', { email, password });

  //       if (response.status && response.token && response.user) {
  //         saveAuth(response.token, response.user);
  //         return true;
  //       }
  //       return false;
  //     } catch (error: any) {
  //       console.error('Login error:', error);
  //       return false;
  //     }
  //   };
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/user/login", { email, password });

      if (response.data?.token && response.data?.user) {
        // ✅ data.token
        saveAuth(response.data.token, response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    userName: string,
    email: string,
    password: string,
    address: string,
    phone: string,
    answer: string
  ) => {
    try {
      const response = await api.post("/user/register", {
        userName,
        email,
        password,
        address,
        phone,
        answer,
      });

      if (response.data.status) {
        toast.success("Account created! Please login.");
        return true;
      } else {
        toast.error(response.data.message || "Registration failed");
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Server error");
      return false;
    }
  };

  const updatePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!auth.token) return false;

    try {
      const response = await api.post("/user/update-Password", {
        oldPassword,
        newPassword,
      });
      // return response.status;
      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      console.error("Password update error:", error);
      return false;
    }
  };

  const logout = () => {
    clearAuth();
  };

  // const value = {
  //   auth,
  //   login,
  //   register,
  //   logout,
  //   updatePassword,
  // };
  const value: AuthContextType = {
    user: auth.user, // ✅ Direct user
    token: auth.token, // Direct token
    login,
    register,
    logout,
    updatePassword,
    // loading: auth.loading, if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
