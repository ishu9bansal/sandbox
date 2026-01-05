"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deletePerioRecord, deletePerioRecords } from "@/store/slices/perioSlice";
import { PerioRecord } from '@/models/perio';
import Button from "@/components/Button";
import PerioRecordList from "./components/PerioRecordList";
import { generatePerioRecordsTable, transformPerioRecordToRep } from "@/models/representation";
import { copyToClipboard, tableToTsvString } from "@/utils/helpers";

export default function PatientsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const records = useAppSelector(state => state.perio.records);

  const handleDeleteRecord = (record: PerioRecord) => {
    if (window.confirm(`Are you sure you want to delete ${record.label}?`)) {
      dispatch(deletePerioRecord(record.id));
    }
  };

  const handleBulkDelete = (recordsToDelete: PerioRecord[]) => {
    const count = recordsToDelete.length;
    if (window.confirm(`Are you sure you want to delete ${count} record${count > 1 ? 's' : ''}?`)) {
      dispatch(deletePerioRecords(recordsToDelete.map(p => p.id)));
    }
  };

  const handleCopyRecords = (recordsToCopy: PerioRecord[]) => {
    copyRecordsToClipboard(recordsToCopy);
    alert(`${recordsToCopy.length} record${recordsToCopy.length > 1 ? 's' : ''} copied to clipboard in TSV format.`);
  };

  const handleViewRecord = (record: PerioRecord) => {
    router.push(`/periodontics/${record.id}`);
  };

  const handleEditRecord = (record: PerioRecord) => {
    router.push(`/periodontics/${record.id}/edit`);
  };

  const handleAddRecord = () => {
    router.push('/periodontics/add');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-4">Record Management</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage perio chart for patients with an intuitive interface.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddRecord} size="sm" className="text-xs sm:text-sm whitespace-nowrap self-start sm:self-auto">
          + Add New Record
        </Button>
      </div>

      <PerioRecordList
        records={records}
        onView={handleViewRecord}
        onEdit={handleEditRecord}
        onDelete={handleDeleteRecord}
        onBulkDelete={handleBulkDelete}
        onCopy={handleCopyRecords}
      />

      {records.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No record found. Add your first record to get started.
          </p>
          <Button variant="primary" onClick={handleAddRecord}>
            + Add First Record
          </Button>
        </div>
      )}
    </div>
  );
}

function copyRecordsToClipboard(records: PerioRecord[]) {
  const reps = records.map(record => transformPerioRecordToRep(record));
  const table = generatePerioRecordsTable(reps);
  const tsv = tableToTsvString(table);
  copyToClipboard(tsv);
}
