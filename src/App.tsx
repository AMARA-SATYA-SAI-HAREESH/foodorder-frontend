import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AdminLogin from "./admin/AdminLogin"; // Add this import

function App() {
  return (
    <AdminAuthProvider>
      {" "}
      {/* Wrap with AdminAuthProvider */}
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="App min-h-screen bg-gray-50">
              {" "}
              {/* Changed to gray-50 */}
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
                        <Route path="/restaurants" element={<Restaurants />} />
                        <Route
                          path="/category/:id"
                          element={<CategoryPage />}
                        />
                        <Route path="/food/:id" element={<FoodDetailPage />} />
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
                        </div>
                      </div>
                    </>
                  }
                />
              </Routes>
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
