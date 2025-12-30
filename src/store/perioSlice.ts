import { PerioRecord, Teeth, Tooth } from '@/models/perio';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PerioState {
  records: PerioRecord[];
  freshId: string | null;
}

const initialState: PerioState = {
  records: [],
  freshId: null,
};

const STUDY_LIMIT = 3;
const defaltLabel = (position: number): Tooth => {
    if (position>7) return 'X'; // generally missing wisdom teeth
    if (position <= STUDY_LIMIT) return 'O'
    return '-';
}

export const generateDefaultTeeth = (): Teeth => {
    const teeth: Teeth = {};
    for(let i=1; i<=4; i++) {   // Quadrants
        for(let j=1; j<=8; j++) {
            const toothNumber = `${i}${j}`;
            teeth[toothNumber] = defaltLabel(j);
        }
    }
    return teeth;
};

// Helper function to generate unique record IDs
const generateRecordId = (): string => {
  return `perio-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const perioSlice = createSlice({
  name: 'perio',
  initialState,
  reducers: {
    addPerioRecord: (state, action: PayloadAction<Omit<PerioRecord, 'id' | 'createdAt' | 'updatedAt'>>) => {
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
    updatePerioRecord: (state, action: PayloadAction<PerioRecord>) => {
      const index = state.records.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = {
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