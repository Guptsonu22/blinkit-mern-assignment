import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // 60s — Render free tier needs up to 50s cold start
    headers: { "Content-Type": "application/json" },
});

// Products
export const getProducts = (params) => api.get("/products", { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get("/products/categories");
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Orders
export const createOrder = (data) => api.post("/orders", data);
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getAllOrders = () => api.get("/orders");

export default api;
