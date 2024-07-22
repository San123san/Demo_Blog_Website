// src/reduxstore/store.js

import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './blogSlice';
import { localStorageMiddleware } from './localStorageMiddleware';


const persistedState = localStorage.getItem('reduxState')
  ? JSON.parse(localStorage.getItem('reduxState'))
  : {};


const store = configureStore({
  reducer: {
    blog: blogReducer,
  },
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
