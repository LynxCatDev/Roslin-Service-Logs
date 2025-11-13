import { configureStore } from '@reduxjs/toolkit';
import serviceLogReducer from './serviceLogSlice';
import draftReducer from './draftSlice';

export const store = configureStore({
  reducer: {
    serviceLogs: serviceLogReducer,
    drafts: draftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
