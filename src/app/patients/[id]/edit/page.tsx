"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePatient } from "@/store/patientSlice";
import { Patient } from '@/models/patient';
import PatientForm from "../../components/PatientForm";

export default function EditPatientPage() {
  const router = useRouter();
  const { id: patient_id } = useParams();
  const dispatch = useAppDispatch();
  const patient = useAppSelector(state =>
    state.patients.patients.find(p => p.id === patient_id)
  );

  if (!patient) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The patient you're trying to edit doesn't exist.
        </p>
      </div>
    );
  }

  const handleUpdatePatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedPatient: Patient = {
      ...patientData,
      id: patient.id,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };

    dispatch(updatePatient(updatedPatient));
    router.push(`/patients/${patient.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PatientForm
        patient={patient}
        onSubmit={handleUpdatePatient}
        onCancel={handleCancel}
      />
    </div>
  );
}
