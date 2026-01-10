// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// function App() {
//   const [foods, setFoods] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get(`${API_URL}/food/getAllFoods`)
//       .then((res) => {
//         setFoods(res.data.foods || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("API Error:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 to-pink-500">
//         Loading Foods...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-8">
//       <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
//         🍕 FoodOrder Frontend
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
//         {foods.length === 0 ? (
//           <p className="col-span-full text-center text-gray-500 text-xl">
//             No foods yet - Add via backend admin! 🚀
//           </p>
//         ) : (
//           foods.map((food: any) => (
//             <div
//               key={food._id}
//               className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-6"
//             >
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 {food.title}
//               </h2>
//               <p className="text-gray-600 mb-4">{food.description}</p>
//               <p className="text-3xl font-bold text-orange-500">
//                 ₹{food.price}
//               </p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import RestaurantPage from "./pages/RestaurantPage";
import ForgotPassword from "./pages/ForgotPassword";
import Restaurants from "./pages/Restaurants";
import FoodDetailPage from "./pages/FoodDetailPage";
import CategoryPage from "./pages/CategoryPage";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 ">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="*" element={<Home />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/food/:id" element={<FoodDetailPage />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
