// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isLoggedIn: false },
  reducers: {
    loginUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logoutUser(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginUser, logoutUser, updateUser } = authSlice.actions;
export const selectUser = s => s.auth.user;
export const selectIsLoggedIn = s => s.auth.isLoggedIn;

export default authSlice.reducer;
