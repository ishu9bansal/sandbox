"use client";

import { useMemo } from "react";
import DataTable, { Column, columnsBuilder } from "@/components/DataTable";
import { Patient } from '@/models/patient';

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
  const columns: Column<Patient>[] = useMemo(() => columnsBuilder(
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
      render: (patient: Patient) => patient.email || '-',
    },
  ), []);

  const bulkActions = useMemo(() => [
    {
      key: 'delete',
      label: 'Delete Selected',
      action: onBulkDelete,
      buttonStyles: {
        background: "#cc3300",
        cursor: "pointer",
      },
    }
  ], [onBulkDelete]);

  const rowActions = useMemo(() => [
    {
      key: 'edit',
      label: 'Edit',
      action: onEdit,
    },
    {
      key: 'delete',
      label: 'Delete',
      action: onDelete,
      buttonStyles: { background: "#552222", color: "#ffffff" },
    },
  ], [onEdit, onDelete]);

  return (
    <DataTable
      title="Patient List"
      data={patients}
      columns={columns}
      getRowId={(patient) => patient.id}
      onRowClick={onView}
      bulkActions={bulkActions}
      rowActions={rowActions}
    />
  );
}
