"use client";

import { JSX, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useSelector } from "react-redux";
import { Patient, selectAllPatients, selectPatientById } from "@/app/store/patientSlice";
import DataSelector from "@/components/DataSelector";
import PatientCard from "@/app/patients/components/PatientCard";

interface PatientFormProps {
  patient_id: string | null;
  onSubmit: (patient_id: string | null) => void;
  onCancel: () => void;
}

export default function PatientForm({ patient_id, onSubmit, onCancel }: PatientFormProps) {
  const patients = useSelector(selectAllPatients);
  const patient = useSelector(selectPatientById(patient_id)) || null;
  const [selected, setSelected] = useState<Patient | null>(patient);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientId = selected?.id || null;
    onSubmit(patientId);
  };
  const toString = (patient: Patient | null) => {
    if (!patient) {
      return "null";
    }
    return `${patient.name} ${patient.age}${patient.sex[0]}`;
  };

  return (
    <Card title={"Assign to Patient" }>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <DataSelector data={patients} selected={selected} onSelect={setSelected} renderer={renderPatient} toString={toString} />
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Back
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Card>
  );
}

function renderPatient(patient: Patient | null): JSX.Element {
  if (!patient) {
    return <span>No Patient Selected</span>;
  }
  return (
    <PatientCard patient={patient} />
  );
}
