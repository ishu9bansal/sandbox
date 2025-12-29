"use client";

import { JSX, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useSelector } from "react-redux";
import { Patient, selectAllPatients } from "@/app/store/patientSlice";
import DataSelector from "@/components/DataSelector";

interface PatientFormProps {
  onSubmit: (patient_id: string | null) => void;
  onCancel: () => void;
}

export default function PatientForm({ onSubmit, onCancel }: PatientFormProps) {
  const patients = useSelector(selectAllPatients);
  const [selected, setSelected] = useState<Patient | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientId = selected?.id || null;
    onSubmit(patientId);
  };

  return (
    <Card title={"Assign to Patient" }>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <DataSelector data={patients} selected={selected} onSelect={setSelected} renderer={renderPatient} />
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
    <div>
      <span>{patient.name} (ID: {patient.id})</span>
    </div>
  );
}
