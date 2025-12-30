"use client";

import { useMemo } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { Patient } from "@/store/patientSlice";

interface PatientListProps {
  patients: Patient[];
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onBulkDelete: (patients: Patient[]) => void;
}

export default function PatientList({ 
  patients, 
  onView, 
  onEdit, 
  onDelete, 
  onBulkDelete 
}: PatientListProps) {
  const columns: Column<Patient>[] = useMemo(() => [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'age',
      header: 'Age',
      sortable: true,
      filterable: true,
      width: 80,
    },
    {
      key: 'sex',
      header: 'Sex',
      sortable: true,
      filterable: true,
      width: 100,
    },
    {
      key: 'contact',
      header: 'Contact',
      sortable: true,
      filterable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      filterable: true,
      render: (value) => value || '-',
    },
  ], []);

  return (
    <DataTable
      title="Patient List"
      data={patients}
      columns={columns}
      getRowId={(patient) => patient.id}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onBulkDelete={onBulkDelete}
    />
  );
}
