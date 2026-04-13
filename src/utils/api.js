// src/utils/api.js
import axios from 'axios';

const PRODUCTS_BASE = 'https://dummyjson.com';

// ── UPDATE THIS WITH YOUR MOCKAPI URL ──────────────────
// 1. Go to https://mockapi.io → Create project
// 2. Add 'users' and 'orders' resources
// 3. Replace the URL below with your project URL
const MOCK_BASE = 'https://YOUR-PROJECT-ID.mockapi.io/api/v1';
// ───────────────────────────────────────────────────────

// Products API (dummyjson)
export const fetchProducts = async ({ limit = 20, skip = 0, search = '', category = '' } = {}) => {
  try {
    if (search) {
      const res = await axios.get(`${PRODUCTS_BASE}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`);
      return res.data;
    }
    if (category) {
      const res = await axios.get(`${PRODUCTS_BASE}/products/category/${category}?limit=${limit}&skip=${skip}`);
      return res.data;
    }
    const res = await axios.get(`${PRODUCTS_BASE}/products?limit=${limit}&skip=${skip}`);
    return res.data;
  } catch (err) {
    console.error('fetchProducts error:', err);
    return { products: [], total: 0 };
  }
};

export const fetchProductById = async (id) => {
  const res = await axios.get(`${PRODUCTS_BASE}/products/${id}`);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await axios.get(`${PRODUCTS_BASE}/products/categories`);
  return res.data;
};

export const fetchProductsByCategory = async (category, limit = 8) => {
  const res = await axios.get(`${PRODUCTS_BASE}/products/category/${category}?limit=${limit}`);
  return res.data;
};

// Users API (MockAPI)
export const registerUser = async (userData) => {
  const res = await axios.post(`${MOCK_BASE}/users`, userData);
  return res.data;
};

export const loginUserApi = async ({ email, password }) => {
  // Test data for login
  const testUsers = [
    { 
      id: 1, 
      email: 'siddiquefaiz521@gmail.com', 
      password: 'Faiz@2008', 
      firstName: 'Faiz', 
      lastName: 'Shaikh',
      phone: '1234567890'
    }
  ];

  const user = testUsers.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  return user;
};

export const updateUserApi = async (id, data) => {
  const res = await axios.put(`${MOCK_BASE}/users/${id}`, data);
  return res.data;
};

// Orders API (MockAPI)
export const createOrder = async (orderData) => {
  const res = await axios.post(`${MOCK_BASE}/orders`, orderData);
  return res.data;
};

export const fetchOrdersByUser = async (userId) => {
  const res = await axios.get(`${MOCK_BASE}/orders`);
  return (res.data || []).filter(o => o.userId === userId);
};
