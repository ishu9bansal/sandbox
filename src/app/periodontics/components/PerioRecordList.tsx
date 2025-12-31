"use client";

import { useMemo } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { PerioRecord } from '@/models/perio';
import { useSelector } from "react-redux";
import { selectAllPatients } from "@/store/patientSlice";

interface PerioRecordListProps {
  records: PerioRecord[];
  onView: (record: PerioRecord) => void;
  onEdit: (record: PerioRecord) => void;
  onDelete: (record: PerioRecord) => void;
  onBulkDelete: (records: PerioRecord[]) => void;
}

export default function PerioRecordList({ 
  records, 
  onView, 
  onEdit, 
  onDelete, 
  onBulkDelete 
}: PerioRecordListProps) {
  const patients = useSelector(selectAllPatients);
  const patientLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    patients.forEach((patient) => {
      map[patient.id] = patient.name;
    });
    return map;
  }, [patients]);
  const columns: Column<PerioRecord>[] = useMemo(() => [
    {
      key: 'label',
      header: 'Label',
      filterable: true,
    },
    {
      key: 'patient',
      header: 'Patient',
      filterable: true,
      accessor: (record: PerioRecord) => record.patientId || "Unassigned",
      render: (patientId: string) => patientLabelMap[patientId] || "Unassigned",
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    }
  ], [patientLabelMap]);

  const copyCsv = (records: PerioRecord[]) => {
    console.log("Copy CSV action triggered for records:", records.length);
  };

  const bulkActions = useMemo(() => [
    {
      key: 'delete',
      label: 'Delete Selected',
      action: onBulkDelete,
      buttonStyles: {
        background: "#cc3300",
        cursor: "pointer",
      },
    },
    {
      key: 'copy',
      label: 'Copy Selected CSV',
      action: copyCsv,
      buttonStyles: {
        background: "#0066cc",
      },
    },
  ], [onBulkDelete, copyCsv]);

  return (
    <DataTable
      title="Record List"
      data={records}
      columns={columns}
      getRowId={(record) => record.id}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      bulkActions={bulkActions}
    />
  );
}
