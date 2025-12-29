import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Tooth = 'X' | 'O' | 'S';    // 'X' = missing, 'O' = Selected, 'S' = Skipped
export type Teeth = { [toothNumber: string]: Tooth; } // e.g., { "11": "value"};
export type PPD_Tooth = number[]; // e.g., [3,4,5,2,3,4]; for 6 sites
export type LGM_Tooth = number[]; // e.g., [0,1,1,0,2,1]; for 6 sites
export type LGM = { [toothNumber: string]: LGM_Tooth; } // e.g., { "11": [0,1,1,0,2,1]};
export type PPD = { [toothNumber: string]: PPD_Tooth } // e.g., { "11": 3};

export interface PerioRecord {
  id: string;
  label: string;
  teeth: Teeth;
  ppd: PPD;
  lgm: LGM;
  createdAt: string;
  updatedAt: string;
}

export interface PerioState {
  records: PerioRecord[];
}

const initialState: PerioState = {
  records: [],
};

const STUDY_LIMIT = 3;
const defaltLabel = (position: number): Tooth => {
    if (position>7) return 'X'; // generally missing wisdom teeth
    return position <= STUDY_LIMIT ? 'O' : 'S';
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
  },
});

export const { addPerioRecord, updatePerioRecord, deletePerioRecord, deletePerioRecords, setPerioRecords } = perioSlice.actions;
export default perioSlice.reducer;

export const selectPerioRecords = (state: { perio: PerioState }) => state.perio.records;
export const selectPerioRecordById = (id: any) => (state: { perio: PerioState }) =>
  state.perio.records.find(record => record.id === id);