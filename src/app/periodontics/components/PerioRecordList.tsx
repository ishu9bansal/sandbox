"use client";

import { useCallback, useMemo } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { PerioRecord } from '@/models/perio';
import { useSelector } from "react-redux";
import { selectAllPatients } from "@/store/patientSlice";
import { copyToClipboard } from "@/utils/helpers";

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
      accessor: (record: PerioRecord) => record.label,
      render: (label: string) => label,
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
      accessor: (record: PerioRecord) => record.createdAt,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      accessor: (record: PerioRecord) => record.updatedAt,
      render: (value: string) => new Date(value).toLocaleDateString(),
    }
  ], [patientLabelMap]);

  const copyAction = useCallback((records: PerioRecord[]) => copyCsv(records, columns), [columns]);

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
      action: copyAction,
      buttonStyles: {
        background: "#0066cc",
      },
    },
  ], [onBulkDelete, copyAction]);

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

function csvEscape(value: any): string {
  let s = value == null ? "" : Array.isArray(value) ? value.join(" ") : String(value);
  s = s.replace(/"/g, '""');
  return `"${s}"`;
}

function copyCsv(records: PerioRecord[], visibleCols: Column<PerioRecord>[]) {
  const header = visibleCols.map((c) => csvEscape(c.header)).join(",");
  const body = records
    .map((row) =>
      visibleCols
        .map((c) => csvEscape(
            c.render?.(c.accessor?.(row), row)
          )
        )
        .join(",")
    )
    .join("\n");
  const csv = header + "\n" + body;
  copyToClipboard(csv).then(() => {
    console.log("CSV copied to clipboard");
  }).catch((err) => {
    console.error("Failed to copy CSV to clipboard:", err);
  });
}