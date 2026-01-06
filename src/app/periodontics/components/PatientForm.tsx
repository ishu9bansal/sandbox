"use client";

import { JSX, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useSelector } from "react-redux";
import { selectAllPatients, selectPatientById } from "@/store/slices/patientSlice";
import { Patient } from '@/models/patient';
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
  const toString = (patient: Patient) => {
    return `${patient.name} ${patient.age}${patient.sex[0]}`;
  };

  return (
    <Card title={"Assign to Patient" }>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <DataSelector data={patients} selected={selected} onSelect={setSelected} renderer={toString} />
          <PatientView patient={selected} />
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

function PatientView({ patient }: { patient: Patient | null; }): JSX.Element {
  return (
    <div className="mt-2">
      {
        patient
        ? (<PatientCard patient={patient} />)
        : (<span>No Patient Selected</span>)
      }
    </div>
  );
}
