'use client';
// src/components/common/ReduxProvider.jsx
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
