"use client";

import { JSX, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { addPatient, selectAllPatients, selectPatientById } from "@/store/slices/patientSlice";
import { Patient, PatientInput } from '@/models/patient';
import PatientCard from "@/app/patients/components/PatientCard";
import DataSelector, { useDataSelectorContext } from "@/components/compositions/data-selector";
import { DialogBox } from "@/components/compositions/dialog-box";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store/hooks";
import { SelectInput } from "@/components/compositions/select-input";

interface PatientSelectProps {
  patient_id: string | null;
  onChange: (patient_id: string | null) => void;
}

export default function PatientSelect({ patient_id, onChange }: PatientSelectProps) {
  const dispatch = useAppDispatch();
  const createPatient = useCallback((data: PatientInput) => {
    dispatch(addPatient(data));
  }, []);
  const patients = useSelector(selectAllPatients);
  const patient = useSelector(selectPatientById(patient_id)) || null;
  const toString = (patient: Patient) => {
    return `${patient.name} ${patient.age}${patient.sex[0]}`;
  };

  const searchValue = (patient: Patient) => {
    return `${patient.name} ${patient.age} ${patient.contact} ${patient.email}`;
  };

  return (
    <div>
      <DataSelector
        data={patients}
        typeLabel="patient"
        isSelected={(p) => patient ? p.id === patient.id : false}
        onSelect={(p) => onChange(p?.id || null)}
        toString={toString}
        uniqueKey={(p) => p.id}
        searchValue={searchValue}
      >
        <EmptySearchView onCreatePatient={createPatient} />
      </DataSelector>
      <PatientView patient={patient} />
    </div>
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
  const onFieldChange = useCallback((key: string, val: string | number) => {
    onChange({ ...patient, [key]: val });
  }, [patient, onChange]);
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label htmlFor="name-1">Name</Label>
        <Input id="name-1" value={name} onChange={e => onFieldChange('name', e.target.value)} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="age-1">Age</Label>
        <Input id="age-1" value={age} onChange={e => onFieldChange('age', e.target.value)} type='number' />
      </div>
      <div className="grid gap-3">
        <Label>Sex</Label>
        <SelectInput value={sex} onChange={val => onFieldChange('sex', val)} options={['Male', 'Female', 'Other']} />
      </div>
    </div>
  );
}
