import { PerioRecord } from '@/models/perio';
import { ModelInput, ModelUpdate } from '@/models/type';
import { generateRecordId } from '@/utils/perio';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PerioState {
  records: PerioRecord[];
  freshId: string | null;
}

const initialState: PerioState = {
  records: [],
  freshId: null,
};

const perioSlice = createSlice({
  name: 'perio',
  initialState,
  reducers: {
    addPerioRecord: (state, action: PayloadAction<ModelInput<PerioRecord>>) => {
      const now = new Date().toISOString();
      const newRecord: PerioRecord = {
        ...action.payload,
        id: generateRecordId(),
        createdAt: now,
        updatedAt: now,
      };
      state.records.push(newRecord);
      state.freshId = newRecord.id;
    },
    updatePerioRecord: (state, action: PayloadAction<ModelUpdate<PerioRecord>>) => {
      const index = state.records.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = {
          ...state.records[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deletePerioRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(r => r.id !== action.payload);
    },
    deletePerioRecords: (state, action: PayloadAction<string[]>) => {
      state.records = state.records.filter(r => !action.payload.includes(r.id));
    },
    setPerioRecords: (state, action: PayloadAction<PerioRecord[]>) => {
      state.records = action.payload;
    },
    resetFreshId: (state) => {
      state.freshId = null;
    },
  },
});

export const { addPerioRecord, updatePerioRecord, deletePerioRecord, deletePerioRecords, setPerioRecords, resetFreshId } = perioSlice.actions;
export default perioSlice.reducer;

export const selectPerioRecords = (state: { perio: PerioState }) => state.perio.records;
export const selectPerioRecordById = (id: any) => (state: { perio: PerioState }) =>
  state.perio.records.find(record => record.id === id);
export const selectFreshPerioRecordId = (state: { perio: PerioState }) => state.perio.freshId;