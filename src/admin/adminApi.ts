import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_URL = "http://localhost:8080";

// Create axios instance with admin token
const getAdminApi = () => {
  // const token = localStorage.getItem("adminToken");
  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("token");
  console.log("🔑 Admin token being used:", token ? "Yes" : "No");
  console.log("🔑 Token substring:", token?.substring(0, 20) + "...");
  if (!token) {
    console.error("❌ No token found in localStorage!");
    console.log("LocalStorage contents:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(
        `${key}: ${localStorage.getItem(`${key}`)?.substring(0, 30)}...`
      );
    }
  }
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Auth APIs
export const adminLogin = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/user/login`, {
    email,
    password,
  });
  return response.data;
};

// Category APIs
export const createCategory = async (data: {
  title: string;
  imageUrl: string;
}) => {
  const api = getAdminApi();
  return api.post("/catogary/create-category", data);
};

export const updateCategory = async (data: {
  id: string;
  title?: string;
  imageUrl?: string;
}) => {
  const api = getAdminApi();
  return api.post("/catogary/update-category", data);
};

export const deleteCategory = async (id: string) => {
  const api = getAdminApi();
  return api.delete(`/catogary/delete-category?id=${id}`);
};

export const getAllCategories = async () => {
  return axios.get(`${API_URL}/catogary/getAllCategories`);
};

// Food APIs
export const createFood = async (data: any) => {
  const api = getAdminApi();
  return api.post("/api/food/create-food", data);
};

export const updateFood = async (data: any) => {
  const api = getAdminApi();
  return api.post("/api/food/update-food", data);
};

export const deleteFood = async (id: string) => {
  const api = getAdminApi();
  return api.delete(`/api/food/delete-food?id=${id}`);
};

export const getAllFoods = async () => {
  return axios.get(`${API_URL}/api/food/getAllFoods`);
};

export const getFoodById = async (id: string) => {
  return axios.get(`${API_URL}/api/food/getFood?id=${id}`);
};

// Restaurant APIs
export const createRestaurant = async (data: any) => {
  const api = getAdminApi();
  return api.post("/restaurant/create-restaurant", data);
};

export const updateRestaurant = async (data: any) => {
  const api = getAdminApi();
  return api.post("/restaurant/update-restaurant", data);
};

export const deleteRestaurant = async (id: string) => {
  const api = getAdminApi();
  return api.delete(`/restaurant/delete-restaurant?id=${id}`);
};

export const getAllRestaurants = async () => {
  return axios.get(`${API_URL}/restaurant/getAllRestaurants`);
};

export const getRestaurantById = async (id: string) => {
  return axios.get(`${API_URL}/restaurant/getRestaurant?id=${id}`);
};

// Order APIs
export const getAllOrders = async () => {
  const api = getAdminApi();
  return api.get("api/order/getAllOrders");
};

export const changeOrderStatus = async (orderId: string, status: string) => {
  const api = getAdminApi();
  return api.post("/order/change-status-order", { orderId, status });
};

// User APIs
// Get all users
export const getAllUsers = async () => {
  const api = getAdminApi(); // this should already point to /user
  return api.get("/user/GetAllUsers"); // → http://localhost:8080/user/GetAllUsers
};

export const deleteUser = async (userId: string) => {
  const api = getAdminApi(); // this should point to /user
  return api.post(`/user/delete-user?id=${userId}`);
};

// Create user (use register route)
export const createUser = async (userData: any) => {
  const api = getAdminApi();
  return api.post("/user/register", userData); // → http://localhost:8080/user/register
};

export const updateUser = async (userId: string, userData: any) => {
  const api = getAdminApi();
  return api.put(`/user/delete-user/${userId}`, userData); // or your actual update endpoint
};

// Add these exports with proper typing:
// export const getAllDrivers = () => axios.get("/all");
// const api = getAdminApi();
// export const getAllDrivers = () => api.get(`${API_URL}/api/driver/all`);
// export const deleteDriver = (driverId: string, reason: string) =>
//   api.delete(`${API_URL}/driver/admin/delete/${driverId}`, {
//     data: { reason },
//   });

// export const updateDriverVerification = (
//   driverId: string,
//   verificationStatus: string
// ) =>
//   api.put(`${API_URL}/api/driver/verification/${driverId}`, {
//     verificationStatus,
//   });

// Driver APIs - CORRECT URLs for your routes
export const getAllDrivers = () => {
  const api = getAdminApi();
  return api.get("/api/driver/all");
};

export const deleteDriver = (driverId: string, reason: string) => {
  const api = getAdminApi();
  // Your route: DELETE /api/driver/admin/delete?id=xxx
  return api.delete(`/api/driver/admin/delete?id=${driverId}`, {
    data: { reason },
  });
};

export const updateDriverVerification = (
  driverId: string,
  verificationStatus: string
) => {
  const api = getAdminApi();
  // Your route: PUT /api/driver/verification?id=xxx
  return api.put(`/api/driver/verification?id=${driverId}`, {
    verificationStatus,
  });
};
