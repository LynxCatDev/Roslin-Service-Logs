import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Draft } from '../types';

interface DraftState {
  drafts: Draft[];
  currentDraftId: string | null;
  saveStatus: 'idle' | 'saving' | 'saved';
}

const initialState: DraftState = {
  drafts: [],
  currentDraftId: null,
  saveStatus: 'idle',
};

const draftSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    setDrafts: (state, action: PayloadAction<Draft[]>) => {
      state.drafts = action.payload;
    },
    addDraft: (state, action: PayloadAction<Draft>) => {
      state.drafts.push(action.payload);
      state.currentDraftId = action.payload.id;
    },
    updateDraft: (state, action: PayloadAction<Draft>) => {
      const index = state.drafts.findIndex(
        (draft) => draft.id === action.payload.id,
      );
      if (index !== -1) {
        state.drafts[index] = action.payload;
      }
    },
    deleteDraft: (state, action: PayloadAction<string>) => {
      state.drafts = state.drafts.filter(
        (draft) => draft.id !== action.payload,
      );
      if (state.currentDraftId === action.payload) {
        state.currentDraftId = null;
      }
    },
    clearAllDrafts: (state) => {
      state.drafts = [];
      state.currentDraftId = null;
    },
    setCurrentDraftId: (state, action: PayloadAction<string | null>) => {
      state.currentDraftId = action.payload;
    },
    setSaveStatus: (
      state,
      action: PayloadAction<'idle' | 'saving' | 'saved'>,
    ) => {
      state.saveStatus = action.payload;
    },
  },
});

export const {
  setDrafts,
  addDraft,
  updateDraft,
  deleteDraft,
  clearAllDrafts,
  setCurrentDraftId,
  setSaveStatus,
} = draftSlice.actions;

export default draftSlice.reducer;
