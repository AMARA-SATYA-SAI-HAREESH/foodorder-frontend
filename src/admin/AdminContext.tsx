import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AdminAuthContextType {
  isAdmin: boolean;
  token: string | null;
  admin: any | null;
  login: (token: string, adminData: any) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("adminToken"),
  );
  const [admin, setAdmin] = useState<any | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("admin");
    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
      setIsAdmin(true);
    }
  }, []);

  const login = (newToken: string, adminData: any) => {
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("admin", JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setToken(null);
    setAdmin(null);
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, token, admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
