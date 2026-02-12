import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Store,
  DollarSign,
  User,
  LogOut,
  Menu,
  X,
  Wallet, // ADD THIS IMPORT
} from "lucide-react";
import { useVendor } from "../context/VendorContext";

const VendorSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, vendor } = useVendor();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/vendor/login");
  };

  const menuItems = [
    { path: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/vendor/foods", icon: Utensils, label: "Foods" },
    { path: "/vendor/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/vendor/restaurant", icon: Store, label: "Restaurant" },
    { path: "/vendor/earnings", icon: DollarSign, label: "Earnings" },
    { path: "/vendor/withdraw", icon: Wallet, label: "Withdraw Funds" }, // FIXED THIS LINE
    { path: "/vendor/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold">
              {vendor?.userName || "Vendor"}
            </h1>
            <p className="text-gray-400 text-sm">Restaurant Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default VendorSidebar;
