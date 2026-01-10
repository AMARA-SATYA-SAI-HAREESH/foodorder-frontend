// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Toaster } from "react-hot-toast";
// import "./index.css";
// import App from "./App";

// // Create root
// const container = document.getElementById("root");
// if (!container) throw new Error("Root container missing");

// const root = ReactDOM.createRoot(container);

// // Render with providers
// root.render(
//   <React.StrictMode>
//     <App />
//     <Toaster
//       position="top-right"
//       toastOptions={{
//         duration: 4000,
//         style: {
//           background: "#ffffff",
//           color: "#374151",
//           fontSize: "14px",
//           boxShadow:
//             "0 10px 15px -3px rgba(0, 0,0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//           borderRadius: "12px",
//           border: "1px solid #e5e7eb",
//           padding: "16px 20px",
//         },
//         success: {
//           style: {
//             border: "1px solid #10b981",
//             background: "#ecfdf5",
//           },
//         },
//         error: {
//           style: {
//             border: "1px solid #ef4444",
//             background: "#fef2f2",
//           },
//         },
//       }}
//     />
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing");

const root = ReactDOM.createRoot(container);

root.render(
  <AuthProvider>
    <CartProvider>
      <App />
      <Toaster position="top-right" />
    </CartProvider>
  </AuthProvider>
);
