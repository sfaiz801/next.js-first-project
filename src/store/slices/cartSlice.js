// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], coupon: null, discount: 0 },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    applyCoupon(state, action) {
      const codes = { SAVE10: 10, SAVE20: 20, FLAT50: 50 };
      const disc = codes[action.payload.toUpperCase()];
      if (disc) {
        state.coupon = action.payload.toUpperCase();
        state.discount = disc;
      } else {
        state.coupon = null;
        state.discount = 0;
      }
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, applyCoupon, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = s => s.cart.items;
export const selectCartCount = s => s.cart.items.reduce((a, i) => a + i.quantity, 0);
export const selectCartSubtotal = s => s.cart.items.reduce((a, i) => a + i.price * i.quantity, 0);
export const selectDiscount = s => s.cart.discount;
export const selectCoupon = s => s.cart.coupon;

export default cartSlice.reducer;
