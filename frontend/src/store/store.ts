import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import linksReducer from './slices/linksSlice';
import statsReducer from './slices/statsSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      links: linksReducer,
      stats: statsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
