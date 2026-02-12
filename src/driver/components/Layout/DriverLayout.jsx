import React, { useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useDriver } from "../../context/DriverContext";
import {
  Home,
  Package,
  DollarSign,
  User,
  MapPin,
  Menu,
  X,
  LogOut,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";

const DriverLayout = () => {
  const { driver, logout } = useDriver();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: "/driver/dashboard", label: "Dashboard", icon: Home },
    { path: "/driver/orders", label: "Orders", icon: Package },
    { path: "/driver/earnings", label: "Earnings", icon: DollarSign },
    { path: "/driver/profile", label: "Profile", icon: User },
    { path: "/driver/help", label: "Help", icon: HelpCircle },
  ];

  if (!driver) {
    return <Navigate to="/driver/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-semibold">Driver Portal</h1>
          <div className="w-10"></div>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{driver?.userName}</h3>
                    <p className="text-sm text-gray-600">
                      {driver?.vehicleNumber}
                    </p>
                  </div>
                </div>
              </div>
              <nav className="p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">Driver Portal</h1>
            <p className="text-sm text-gray-600">Manage your deliveries</p>
          </div>

          {/* Driver Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {driver?.userName}
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      driver?.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <p className="text-sm text-gray-600 truncate">
                    {driver?.vehicleNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {navItems.find((item) => item.path === location.pathname)
                    ?.label || "Dashboard"}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Bell size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Main Content */}
      <div className="lg:hidden pt-16">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DriverLayout;
