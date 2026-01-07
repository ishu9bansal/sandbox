import { ModelInput, ModelUpdate } from "./type";

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  contact?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export type PatientInput = ModelInput<Patient>;
export type PatientUpdate = ModelUpdate<Patient>;
