// // src/App.tsx - Fixed Version
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom"; // Added Navigate
// import { AuthProvider } from "./context/AuthContext";
// import { CartProvider } from "./context/CartContext";
// import Header from "./components/Header";
// import Home from "./pages/Home";
// import Cart from "./pages/Cart";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import RestaurantPage from "./pages/RestaurantPage";
// import ForgotPassword from "./pages/ForgotPassword";
// import Restaurants from "./pages/Restaurants";
// import FoodDetailPage from "./pages/FoodDetailPage";
// import CategoryPage from "./pages/CategoryPage";
// import Orders from "./pages/Orders";
// import Checkout from "./pages/Checkout";
// import SearchPage from "./pages/SearchPage";
// import AllFoods from "./pages/AllFoods";
// import AdminRoutes from "./admin/AdminRoutes";
// import { AdminAuthProvider } from "./admin/AdminContext";

// // Import Vendor components
// import { VendorProvider } from "./vendor/context/VendorContext";
// import VendorLogin from "./vendor/pages/VendorLogin";
// import VendorRegister from "./vendor/pages/VendorRegister";
// import VendorLayout from "./vendor/components/VendorLayout";
// import VendorDashboard from "./vendor/pages/VendorDashboard";
// import VendorFoods from "./vendor/pages/VendorFoods";
// import VendorOrders from "./vendor/pages/VendorOrders";
// import VendorRestaurant from "./vendor/pages/VendorRestaurant";
// import VendorEarnings from "./vendor/pages/VendorEarnings";
// import VendorProfile from "./vendor/pages/VendorProfile";
// // inport driver components
// import DriverLogin from "./driver/pages/DriverLogin";
// import DriverRegister from "./driver/pages/DriverRegister";
// import DriverDashboard from "./driver/pages/DriverDashboard";
// import { DriverProvider } from "./driver/context/DriverContext";
// import DriverLayout from "./driver/components/Layout/DriverLayout";
// import DriverOrders from "./driver/pages/DriverOrders";
// import DriverEarnings from "./driver/pages/DriverEarnings";
// import DriverHelp from "./driver/pages/DriverHelp";
// import DriverProfile from "./driver/pages/DriverProfile";

// // Loading component
// const LoadingSpinner = () => (
//   <div className="min-h-screen flex items-center justify-center">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//   </div>
// );

// // Protected Route Component for Vendor
// const VendorProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const token = localStorage.getItem("vendorToken");

//   if (!token) {
//     return <Navigate to="/vendor/login" />;
//   }

//   return <>{children}</>;
// };

// function App() {
//   return (
//     <AdminAuthProvider>
//       <VendorProvider>
//         <Router>
//           <AuthProvider>
//             <CartProvider>
//               <div className="App min-h-screen bg-gray-50">
//                 <Routes>
//                   {/* User Routes with Header */}
//                   <Route
//                     path="/*"
//                     element={
//                       <>
//                         <Header />
//                         <Routes>
//                           <Route path="/" element={<Home />} />
//                           <Route path="/cart" element={<Cart />} />
//                           <Route path="/login" element={<Login />} />
//                           <Route path="/register" element={<Register />} />
//                           <Route
//                             path="/forgot-password"
//                             element={<ForgotPassword />}
//                           />
//                           <Route
//                             path="/restaurant/:id"
//                             element={<RestaurantPage />}
//                           />
//                           <Route
//                             path="/restaurants"
//                             element={<Restaurants />}
//                           />
//                           <Route
//                             path="/category/:id"
//                             element={<CategoryPage />}
//                           />
//                           <Route
//                             path="/food/:id"
//                             element={<FoodDetailPage />}
//                           />
//                           <Route path="/orders" element={<Orders />} />
//                           <Route path="/checkout" element={<Checkout />} />
//                           <Route path="/search" element={<SearchPage />} />
//                           <Route path="/all-foods" element={<AllFoods />} />
//                         </Routes>
//                       </>
//                     }
//                   />
//                   {/* Admin Routes (No Header) */}
//                   <Route path="/admin/*" element={<AdminRoutes />} />
//                   {/* Vendor Public Routes (No Header) */}
//                   <Route path="/vendor/login" element={<VendorLogin />} />
//                   <Route path="/vendor/register" element={<VendorRegister />} />
//                   {/* Vendor Protected Routes (No Header, uses VendorLayout) */}
//                   <Route
//                     path="/vendor/*"
//                     element={
//                       <VendorProtectedRoute>
//                         <VendorLayout />
//                       </VendorProtectedRoute>
//                     }
//                   >
//                     <Route path="dashboard" element={<VendorDashboard />} />
//                     <Route path="foods" element={<VendorFoods />} />
//                     <Route path="orders" element={<VendorOrders />} />
//                     <Route path="restaurant" element={<VendorRestaurant />} />
//                     <Route path="earnings" element={<VendorEarnings />} />
//                     <Route path="profile" element={<VendorProfile />} />
//                     <Route index element={<Navigate to="dashboard" />} />
//                   </Route>
//                   <Route path="/driver/login" element={<DriverLogin />} />
//                   <Route path="/driver/register" element={<DriverRegister />} />
//                   // Protected driver routes
//                   <Route
//                     path="/driver/*"
//                     element={
//                       <DriverProvider>
//                         <DriverLayout />
//                       </DriverProvider>
//                     }
//                   >
//                     <Route path="dashboard" element={<DriverDashboard />} />
//                     <Route path="orders" element={<DriverOrders />} />
//                     <Route path="earnings" element={<DriverEarnings />} />
//                     <Route path="profile" element={<DriverProfile />} />
//                     {/* <Route path="documents" element={<DriverDocuments />} /> */}
//                   </Route>
//                   {/* 404 */}
//                   <Route
//                     path="*"
//                     element={
//                       <>
//                         <Header />
//                         <div className="min-h-screen flex items-center justify-center">
//                           <div className="text-center">
//                             <h1 className="text-4xl font-bold text-gray-900 mb-4">
//                               404
//                             </h1>
//                             <p className="text-gray-600">Page not found</p>
//                             <div className="mt-6 space-x-4">
//                               <a
//                                 href="/"
//                                 className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//                               >
//                                 Go to Home
//                               </a>
//                               <a
//                                 href="/vendor/login"
//                                 className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
//                               >
//                                 Vendor Login
//                               </a>
//                               <a
//                                 href="/admin"
//                                 className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
//                               >
//                                 Admin Login
//                               </a>
//                             </div>
//                           </div>
//                         </div>
//                       </>
//                     }
//                   />
//                 </Routes>
//               </div>
//             </CartProvider>
//           </AuthProvider>
//         </Router>
//       </VendorProvider>
//     </AdminAuthProvider>
//   );
// }

// export default App;

// src/App.tsx - Fixed Version with DriverProvider wrapping
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantPage from "./pages/RestaurantPage";
import ForgotPassword from "./pages/ForgotPassword";
import Restaurants from "./pages/Restaurants";
import FoodDetailPage from "./pages/FoodDetailPage";
import CategoryPage from "./pages/CategoryPage";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import SearchPage from "./pages/SearchPage";
import AllFoods from "./pages/AllFoods";
import AdminRoutes from "./admin/AdminRoutes";
import { AdminAuthProvider } from "./admin/AdminContext";

// Import Vendor components
import { VendorProvider } from "./vendor/context/VendorContext";
import VendorLogin from "./vendor/pages/VendorLogin";
import VendorRegister from "./vendor/pages/VendorRegister";
import VendorLayout from "./vendor/components/VendorLayout";
import VendorDashboard from "./vendor/pages/VendorDashboard";
import VendorFoods from "./vendor/pages/VendorFoods";
import VendorOrders from "./vendor/pages/VendorOrders";
import VendorRestaurant from "./vendor/pages/VendorRestaurant";
import VendorEarnings from "./vendor/pages/VendorEarnings";
import VendorProfile from "./vendor/pages/VendorProfile";
import WithdrawalPage from "./vendor/pages/WithdrawalPage";

// Import Driver components
import { DriverProvider } from "./driver/context/DriverContext";
import DriverLogin from "./driver/pages/DriverLogin";
import DriverRegister from "./driver/pages/DriverRegister";
import DriverDashboard from "./driver/pages/DriverDashboard";
import DriverLayout from "./driver/components/Layout/DriverLayout";
import DriverOrders from "./driver/pages/DriverOrders";
import DriverEarnings from "./driver/pages/DriverEarnings";
import DriverHelp from "./driver/pages/DriverHelp";
import DriverProfile from "./driver/pages/DriverProfile";
import { SocketProvider } from "./context/SocketContext";

// Protected Route Component for Vendor
const VendorProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("vendorToken");
  if (!token) {
    return <Navigate to="/vendor/login" />;
  }
  return <>{children}</>;
};

// Protected Route Component for Driver
const DriverProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("driverToken");
  if (!token) {
    return <Navigate to="/driver/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AdminAuthProvider>
          <VendorProvider>
            <DriverProvider>
              {" "}
              {/* Wrap everything with DriverProvider */}
              <Router>
                <CartProvider>
                  <div className="App min-h-screen bg-gray-50">
                    <Routes>
                      {/* User Routes with Header */}
                      <Route
                        path="/*"
                        element={
                          <>
                            <Header />
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/cart" element={<Cart />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route
                                path="/forgot-password"
                                element={<ForgotPassword />}
                              />
                              <Route
                                path="/restaurant/:id"
                                element={<RestaurantPage />}
                              />
                              <Route
                                path="/restaurants"
                                element={<Restaurants />}
                              />
                              <Route
                                path="/category/:id"
                                element={<CategoryPage />}
                              />
                              <Route
                                path="/food/:id"
                                element={<FoodDetailPage />}
                              />
                              <Route path="/orders" element={<Orders />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/search" element={<SearchPage />} />
                              <Route path="/all-foods" element={<AllFoods />} />
                            </Routes>
                          </>
                        }
                      />

                      {/* Admin Routes (No Header) */}
                      <Route path="/admin/*" element={<AdminRoutes />} />

                      {/* Vendor Public Routes (No Header) */}
                      <Route path="/vendor/login" element={<VendorLogin />} />
                      <Route
                        path="/vendor/register"
                        element={<VendorRegister />}
                      />

                      {/* Vendor Protected Routes */}
                      <Route
                        path="/vendor/*"
                        element={
                          <VendorProtectedRoute>
                            <VendorLayout />
                          </VendorProtectedRoute>
                        }
                      >
                        <Route path="dashboard" element={<VendorDashboard />} />
                        <Route path="foods" element={<VendorFoods />} />
                        <Route path="orders" element={<VendorOrders />} />
                        <Route
                          path="restaurant"
                          element={<VendorRestaurant />}
                        />
                        <Route path="earnings" element={<VendorEarnings />} />
                        <Route path="profile" element={<VendorProfile />} />
                        <Route path="withdraw" element={<WithdrawalPage />} />
                        <Route index element={<Navigate to="dashboard" />} />
                      </Route>

                      {/* Driver Public Routes - Already have access to DriverProvider */}
                      <Route path="/driver/login" element={<DriverLogin />} />
                      <Route
                        path="/driver/register"
                        element={<DriverRegister />}
                      />

                      {/* Driver Protected Routes */}
                      <Route
                        path="/driver/*"
                        element={
                          <DriverProtectedRoute>
                            <DriverLayout />
                          </DriverProtectedRoute>
                        }
                      >
                        <Route path="dashboard" element={<DriverDashboard />} />
                        <Route path="orders" element={<DriverOrders />} />
                        <Route path="earnings" element={<DriverEarnings />} />
                        <Route path="profile" element={<DriverProfile />} />
                        <Route path="help" element={<DriverHelp />} />
                        <Route index element={<Navigate to="dashboard" />} />
                      </Route>

                      {/* 404 */}
                      <Route
                        path="*"
                        element={
                          <>
                            <Header />
                            <div className="min-h-screen flex items-center justify-center">
                              <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                  404
                                </h1>
                                <p className="text-gray-600">Page not found</p>
                                <div className="mt-6 space-x-4">
                                  <a
                                    href="/"
                                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                  >
                                    Go to Home
                                  </a>
                                  <a
                                    href="/vendor/login"
                                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                  >
                                    Vendor Login
                                  </a>
                                  <a
                                    href="/admin"
                                    className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
                                  >
                                    Admin Login
                                  </a>
                                </div>
                              </div>
                            </div>
                          </>
                        }
                      />
                    </Routes>
                  </div>
                </CartProvider>
              </Router>
            </DriverProvider>
          </VendorProvider>
        </AdminAuthProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
