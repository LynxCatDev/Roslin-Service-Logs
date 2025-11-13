import { configureStore } from '@reduxjs/toolkit';
import serviceLogReducer from './serviceLogSlice';

export const store = configureStore({
  reducer: {
    serviceLogs: serviceLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
