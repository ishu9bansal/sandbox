"use client";

import { useMemo } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { PerioRecord } from "@/app/store/perioSlice";

interface PerioRecordListProps {
  records: PerioRecord[];
  onView: (patient: PerioRecord) => void;
  onEdit: (patient: PerioRecord) => void;
  onDelete: (patient: PerioRecord) => void;
  onBulkDelete: (patients: PerioRecord[]) => void;
}

export default function PerioRecordList({ 
  records, 
  onView, 
  onEdit, 
  onDelete, 
  onBulkDelete 
}: PerioRecordListProps) {
  const columns: Column<PerioRecord>[] = useMemo(() => [
    {
      key: 'label',
      header: 'Label',
      filterable: true,
    },
  ], []);

  return (
    <DataTable
      title="Record List"
      data={records}
      columns={columns}
      getRowId={(record) => record.id}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onBulkDelete={onBulkDelete}
    />
  );
}
