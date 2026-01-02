"use client";

import { useCallback, useMemo } from "react";
import DataTable from "@/components/DataTable";
import { columnsBuilder } from "@/components/DataTable/columns";
import { Column } from "@/components/DataTable/types";
import { PerioRecord } from '@/models/perio';
import { useSelector } from "react-redux";
import { selectAllPatients } from "@/store/slices/patientSlice";

interface PerioRecordListProps {
  records: PerioRecord[];
  onView: (record: PerioRecord) => void;
  onEdit: (record: PerioRecord) => void;
  onDelete: (record: PerioRecord) => void;
  onBulkDelete: (records: PerioRecord[]) => void;
  onCopy: (records: PerioRecord[]) => void;
}

export default function PerioRecordList({ 
  records, 
  onView, 
  onEdit, 
  onDelete, 
  onBulkDelete,
  onCopy,
}: PerioRecordListProps) {
  const patients = useSelector(selectAllPatients);
  const patientLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    patients.forEach((patient) => {
      map[patient.id] = patient.name;
    });
    return map;
  }, [patients]);
  const patientAccessor = useCallback((record: PerioRecord) => {
    const key = record.patientId || "";
    return patientLabelMap[key] || "Unassigned";
  }, [patientLabelMap]);
  const columns: Column<PerioRecord>[] = useMemo(() => columnsBuilder(
    {
      key: 'label',
      header: 'Label',
      filterable: true,
    },
    {
      key: 'note',
      header: 'Note',
      filterable: true,
    },
    {
      key: 'patient',
      header: 'Patient',
      filterable: true,
      accessor: patientAccessor,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      accessor: (record: PerioRecord) => new Date(record.createdAt).toLocaleDateString(),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      accessor: (record: PerioRecord) => new Date(record.updatedAt).toLocaleDateString(),
    },
  ), [patientAccessor]);

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
      label: 'Copy Selected',
      action: onCopy,
      buttonStyles: {
        background: "#0066cc",
      },
    },
  ], [onBulkDelete, onCopy]);

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
      title="Record List"
      data={records}
      columns={columns}
      getRowId={(record) => record.id}
      onRowClick={onView}
      bulkActions={bulkActions}
      rowActions={rowActions}
    />
  );
}
