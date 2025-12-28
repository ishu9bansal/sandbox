"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import { addPatient, Patient } from "@/app/store/patientSlice";
import PatientForm from "../components/PatientForm";

export default function AddPatientPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleAddPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(addPatient(patientData));
    router.push('/patients');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PatientForm
        onSubmit={handleAddPatient}
        onCancel={handleCancel}
      />
    </div>
  );
}
