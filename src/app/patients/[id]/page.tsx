"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { deletePatient, Patient } from "@/app/store/patientSlice";
import Button from "@/components/Button";
import PatientDetails from "../components/PatientDetails";

interface PatientPageProps {
  params: {
    id: string;
  };
}

export default function PatientPage({ params }: PatientPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const patient = useAppSelector(state =>
    state.patients.patients.find(p => p.id === params.id)
  );

  if (!patient) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The patient you're looking for doesn't exist.
        </p>
        <Button variant="primary" onClick={() => router.push('/patients')}>
          Back to Patient List
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      dispatch(deletePatient(patient.id));
      router.push('/patients');
    }
  };

  const handleEdit = () => {
    router.push(`/patients/${patient.id}/edit`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PatientDetails
        patient={patient}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}
