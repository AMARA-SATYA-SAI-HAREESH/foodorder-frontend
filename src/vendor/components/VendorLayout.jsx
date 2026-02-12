// src/vendor/components/VendorLayout.jsx - UPDATED
import React from "react";
import { Outlet } from "react-router-dom";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";

const VendorLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <VendorSidebar />
      <div className="lg:ml-64 w-full max-w-full">
        <VendorHeader />
        <main className="p-2 md:p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
          <div className="w-full max-w-full overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
