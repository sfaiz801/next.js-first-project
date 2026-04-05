// src/utils/api.js
import axios from 'axios';

const PRODUCTS_BASE = 'https://dummyjson.com';
const MOCK_BASE = 'https://6840d09f5b39a8039a58cfb7.mockapi.io/api/v1';

// ─── Products API (dummyjson) ────────────────────────────

export const fetchProducts = async ({ limit = 20, skip = 0, search = '', category = '' } = {}) => {
  if (search) {
    const res = await axios.get(`${PRODUCTS_BASE}/products/search?q=${search}&limit=${limit}&skip=${skip}`);
    return res.data;
  }
  if (category) {
    const res = await axios.get(`${PRODUCTS_BASE}/products/category/${category}?limit=${limit}&skip=${skip}`);
    return res.data;
  }
  const res = await axios.get(`${PRODUCTS_BASE}/products?limit=${limit}&skip=${skip}`);
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await axios.get(`${PRODUCTS_BASE}/products/${id}`);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await axios.get(`${PRODUCTS_BASE}/products/categories`);
  return res.data;
};

export const fetchProductsByCategory = async (category, limit = 20) => {
  const res = await axios.get(`${PRODUCTS_BASE}/products/category/${category}?limit=${limit}`);
  return res.data;
};

// ─── Users API (mockapi) ─────────────────────────────────

export const registerUser = async (userData) => {
  const res = await axios.post(`${MOCK_BASE}/users`, userData);
  return res.data;
};

export const loginUserApi = async ({ email, password }) => {
  const res = await axios.get(`${MOCK_BASE}/users`);
  const user = res.data.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  return user;
};

export const getUserById = async (id) => {
  const res = await axios.get(`${MOCK_BASE}/users/${id}`);
  return res.data;
};

export const updateUserApi = async (id, data) => {
  const res = await axios.put(`${MOCK_BASE}/users/${id}`, data);
  return res.data;
};

// ─── Orders API (mockapi) ────────────────────────────────

export const createOrder = async (orderData) => {
  const res = await axios.post(`${MOCK_BASE}/orders`, orderData);
  return res.data;
};

export const fetchOrdersByUser = async (userId) => {
  const res = await axios.get(`${MOCK_BASE}/orders?userId=${userId}`);
  return res.data;
};

export const fetchOrderById = async (orderId) => {
  const res = await axios.get(`${MOCK_BASE}/orders/${orderId}`);
  return res.data;
};
