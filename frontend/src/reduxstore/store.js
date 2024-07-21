// src/reduxstore/store.js

import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './blogSlice';
import { localStorageMiddleware } from './localStorageMiddleware';


const persistedState = localStorage.getItem('reduxState')
  ? JSON.parse(localStorage.getItem('reduxState'))
  : {};

  console.log('Persisted State:', persistedState);


const store = configureStore({
  reducer: {
    blog: blogReducer,
    // Add other reducers as needed
  },
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
