"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addPatient, updatePatient, deletePatient, deletePatients, Patient } from "@/app/store/patientSlice";
import Button from "@/components/Button";
import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import PatientDetails from "./components/PatientDetails";

type View = 'list' | 'add' | 'edit' | 'details';

export default function PatientsPage() {
  const dispatch = useAppDispatch();
  const patients = useAppSelector(state => state.patients.patients);
  
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const generateId = () => {
    return `patient-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  const handleAddPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPatient: Patient = {
      ...patientData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    dispatch(addPatient(newPatient));
    setCurrentView('list');
  };

  const handleUpdatePatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedPatient) {
      const updatedPatient: Patient = {
        ...patientData,
        id: selectedPatient.id,
        createdAt: selectedPatient.createdAt,
        updatedAt: new Date().toISOString(),
      };
      
      dispatch(updatePatient(updatedPatient));
      setCurrentView('list');
      setSelectedPatient(null);
    }
  };

  const handleDeletePatient = (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      dispatch(deletePatient(patient.id));
      if (currentView === 'details') {
        setCurrentView('list');
        setSelectedPatient(null);
      }
    }
  };

  const handleBulkDelete = (patientsToDelete: Patient[]) => {
    const count = patientsToDelete.length;
    if (window.confirm(`Are you sure you want to delete ${count} patient${count > 1 ? 's' : ''}?`)) {
      dispatch(deletePatients(patientsToDelete.map(p => p.id)));
    }
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('details');
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('edit');
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedPatient(null);
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
        {currentView === 'list' && (
          <Button variant="primary" onClick={() => setCurrentView('add')}>
            + Add New Patient
          </Button>
        )}
      </div>

      {currentView === 'list' && (
        <PatientList
          patients={patients}
          onView={handleViewPatient}
          onEdit={handleEditPatient}
          onDelete={handleDeletePatient}
          onBulkDelete={handleBulkDelete}
        />
      )}

      {currentView === 'add' && (
        <PatientForm
          onSubmit={handleAddPatient}
          onCancel={handleCancel}
        />
      )}

      {currentView === 'edit' && selectedPatient && (
        <PatientForm
          patient={selectedPatient}
          onSubmit={handleUpdatePatient}
          onCancel={handleCancel}
        />
      )}

      {currentView === 'details' && selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onEdit={() => setCurrentView('edit')}
          onDelete={() => handleDeletePatient(selectedPatient)}
          onBack={handleCancel}
        />
      )}

      {patients.length === 0 && currentView === 'list' && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No patients found. Add your first patient to get started.
          </p>
          <Button variant="primary" onClick={() => setCurrentView('add')}>
            + Add First Patient
          </Button>
        </div>
      )}
    </div>
  );
}
