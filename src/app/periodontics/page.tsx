"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { deletePatient, deletePatients, Patient } from "@/app/store/patientSlice";
import Button from "@/components/Button";
import PatientList from "./components/PatientList";

export default function PatientsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const patients = useAppSelector(state => state.patients.patients);

  const handleDeletePatient = (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      dispatch(deletePatient(patient.id));
    }
  };

  const handleBulkDelete = (patientsToDelete: Patient[]) => {
    const count = patientsToDelete.length;
    if (window.confirm(`Are you sure you want to delete ${count} patient${count > 1 ? 's' : ''}?`)) {
      dispatch(deletePatients(patientsToDelete.map(p => p.id)));
    }
  };

  const handleViewPatient = (patient: Patient) => {
    router.push(`/patients/${patient.id}`);
  };

  const handleEditPatient = (patient: Patient) => {
    router.push(`/patients/${patient.id}/edit`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-4">Patient Management</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage patient records with an intuitive interface.
          </p>
        </div>
        <Button variant="primary" onClick={() => router.push('/patients/add')}>
          + Add New Patient
        </Button>
      </div>

      <PatientList
        patients={patients}
        onView={handleViewPatient}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onBulkDelete={handleBulkDelete}
      />

      {patients.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No patients found. Add your first patient to get started.
          </p>
          <Button variant="primary" onClick={() => router.push('/patients/add')}>
            + Add First Patient
          </Button>
        </div>
      )}
    </div>
  );
}
