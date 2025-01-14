import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../slices/userSlice'; 

const store = configureStore({
  reducer: {
    auth : dataReducer,
  },
});

export default store;
