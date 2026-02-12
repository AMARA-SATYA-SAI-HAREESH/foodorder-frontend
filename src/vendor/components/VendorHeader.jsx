// src/vendor/components/VendorHeader.jsx - UPDATED
import React from "react";
import { Bell, Search } from "lucide-react";
import { useVendor } from "../context/VendorContext";
import { IMAGE_URLS } from "../utils/imageUrls"; // Add import
const VendorHeader = () => {
  const { vendor, restaurant } = useVendor();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between w-full overflow-hidden">
        {/* Search Bar - Hidden on small screens */}
        <div className="hidden md:block flex-1 max-w-xl">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search orders, foods..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Restaurant Status - Mobile only badge */}
          <div className="md:hidden flex items-center gap-2 px-2 py-1 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-green-700">
              {restaurant?.isOpen ? "Open" : "Closed"}
            </span>
          </div>

          {/* Vendor Info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="hidden md:block text-right min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {vendor?.userName || "Vendor"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {restaurant?.title || "Restaurant"}
              </p>
            </div>
            <img
              src={vendor?.profile || IMAGE_URLS.DEFAULT_PROFILE}
              alt="Vendor"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0"
              onError={(e) => {
                e.target.src = IMAGE_URLS.DEFAULT_PROFILE;
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Search - Shows below on mobile */}
      <div className="md:hidden mt-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
