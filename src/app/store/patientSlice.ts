import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  contact: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientState {
  patients: Patient[];
}

const initialState: PatientState = {
  patients: [],
};

// Helper function to generate unique patient IDs
const generatePatientId = (): string => {
  return `patient-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    addPatient: (state, action: PayloadAction<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      const newPatient: Patient = {
        ...action.payload,
        id: generatePatientId(),
        createdAt: now,
        updatedAt: now,
      };
      state.patients.push(newPatient);
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
    },
    deletePatients: (state, action: PayloadAction<string[]>) => {
      state.patients = state.patients.filter(p => !action.payload.includes(p.id));
    },
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
    },
  },
});

export const { addPatient, updatePatient, deletePatient, deletePatients, setPatients } = patientSlice.actions;
export default patientSlice.reducer;
