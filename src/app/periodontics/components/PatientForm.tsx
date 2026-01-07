"use client";

import { JSX, useCallback, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useSelector } from "react-redux";
import { addPatient, selectAllPatients, selectPatientById } from "@/store/slices/patientSlice";
import { Patient, PatientInput } from '@/models/patient';
import PatientCard from "@/app/patients/components/PatientCard";
import DataSelector, { useDataSelectorContext } from "@/components/compositions/data-selector";
import { DialogBox } from "@/components/compositions/dialog-box";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store/hooks";

interface PatientSelectProps {
  patient_id: string | null;
  onSubmit: (patient_id: string | null) => void;
  onCancel: () => void;
}

export default function PatientSelect({ patient_id, onSubmit, onCancel }: PatientSelectProps) {
  const dispatch = useAppDispatch();
  const createPatient = useCallback((data: PatientInput) => {
    dispatch(addPatient(data));
  }, []);
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

  const searchValue = (patient: Patient) => {
    return `${patient.name} ${patient.age} ${patient.contact} ${patient.email}`;
  };

  return (
    <Card title={"Assign to Patient" }>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <DataSelector
            data={patients}
            typeLabel="patient"
            isSelected={(p) => selected ? p.id === selected.id : false}
            onSelect={setSelected}
            toString={toString}
            uniqueKey={(p) => p.id}
            searchValue={searchValue}
          >
            <EmptySearchView onCreatePatient={createPatient} />
          </DataSelector>
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

function EmptySearchView({ onCreatePatient }: { onCreatePatient: (data: PatientInput) => void; }) {
  const {
    searchTerm: search,
    setSearchTerm: setSearch,
  } = useDataSelectorContext();
  return (
    <>
      <div>No results for "{search}"</div>
      <CreatePatientDialog key={search} patientName={search} onCreate={(data) => {
        onCreatePatient(data);
        setSearch("");
      }} />
    </>
  );
}

function CreatePatientDialog({ patientName, onCreate }: { patientName: string; onCreate: (data: PatientInput) => void; }) {
  const triggerText = `Create Patient "${patientName}" +`;
  const [formData, setFormData] = useState<PatientInput>({ name: patientName, age: 20, sex: "Male" });
  const handleSubmit = useCallback(() => {
    onCreate(formData);
    // reset form data
    setFormData({ name: "", age: 20, sex: "Male" });
    // return true to close the dialog
    return true;
  }, [formData]);
  return (
    <DialogBox
      triggerText={triggerText}
      title="Patient Information"
      submitText="Create"
      onSubmit={handleSubmit}
    >
      <PatientForm patient={formData} onChange={setFormData} />
    </DialogBox>
  );
}

function PatientForm({ patient, onChange }: { patient: PatientInput; onChange: (data: PatientInput) => void }) {
  const { name, age, sex } = patient;
  const onFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Note: make sure to use the name attribute on Input components
    onChange({ ...patient, [e.target.name]: e.target.value });
  }, [patient, onChange]);
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label htmlFor="name-1">Name</Label>
        <Input id="name-1" name="name" value={name} onChange={onFieldChange} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="age-1">Age</Label>
        <Input id="age-1" name="age" value={age} onChange={onFieldChange} type='number' />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="sex-1">Sex</Label>
        <Input id="sex-1" name="sex" value={sex} onChange={onFieldChange} />
      </div>
    </div>
  );
}
