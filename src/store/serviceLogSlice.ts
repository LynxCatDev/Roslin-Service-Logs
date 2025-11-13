import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ServiceLog } from '../types';

interface ServiceLogState {
  logs: ServiceLog[];
}

const initialState: ServiceLogState = {
  logs: [],
};

const serviceLogSlice = createSlice({
  name: 'serviceLogs',
  initialState,
  reducers: {
    addServiceLog: (state, action: PayloadAction<ServiceLog>) => {
      state.logs.push(action.payload);
    },
    updateServiceLog: (state, action: PayloadAction<ServiceLog>) => {
      const index = state.logs.findIndex((log) => log.id === action.payload.id);
      if (index !== -1) {
        state.logs[index] = action.payload;
      }
    },
    deleteServiceLog: (state, action: PayloadAction<string>) => {
      state.logs = state.logs.filter((log) => log.id !== action.payload);
    },
  },
});

export const { addServiceLog, updateServiceLog, deleteServiceLog } =
  serviceLogSlice.actions;
export default serviceLogSlice.reducer;
