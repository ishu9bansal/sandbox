import { Patient, PatientInput, PatientUpdate } from '@/models/patient';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    addPatient: (state, action: PayloadAction<PatientInput>) => {
      const now = new Date().toISOString();
      const newPatient: Patient = {
        ...action.payload,
        id: generatePatientId(),
        createdAt: now,
        updatedAt: now,
      };
      state.patients.push(newPatient);
    },
    updatePatient: (state, action: PayloadAction<PatientUpdate>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = {
          ...state.patients[index],
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

export const selectAllPatients = (state: { patients: PatientState }) => state.patients.patients;
export const selectPatientById = (id: string | null) => (state: { patients: PatientState }) => state.patients.patients.find(p => p.id === id);
