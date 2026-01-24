"use client";

import Card from "@/components/compositions/card";
import { CommonMeasurement, PerioRecord, TeethSelection } from '@/models/perio';
import TeethVisualization from "@/components/TeethVisualization";
import PerioInput from "./input/PerioInput";
import PatientCard from "@/app/patients/components/PatientCard";
import { useSelector } from "react-redux";
import { selectPatientById } from "@/store/slices/patientSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Quadrant } from "@/models/theeth";
import { Edit } from "lucide-react";

interface PerioRecordDetailsProps {
  record: PerioRecord;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export default function PerioRecordDetails({ record, onEdit, onDelete, onBack }: PerioRecordDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const patient = useSelector(selectPatientById(record.patientId));

  const router = useRouter();
  const onEditEntry = (entryId: string) => () => router.push(`/periodontics/${record.id}/entry/${entryId}`);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold">Record Details</h2>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" onClick={onBack} size="sm" className="text-xs sm:text-sm">
            ← Back to List
          </Button>
          <Button variant="outline" onClick={onEdit} size="sm" className="text-xs sm:text-sm">
            Edit Record
          </Button>
          <Button variant="destructive" onClick={onDelete} size="sm" className="text-xs sm:text-sm">
            Delete Record
          </Button>
        </div>
      </div>

      <Card title="Clinical Data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Visit
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {record.label}
            </p>
          </div>
        </div>
        <div className="my-6 pt-4 border-t border-gray-300 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Teeth Information
          </label>
          <div className="flex mt-2 space-y-4 justify-between">
            <TeethVisualization data={record.teeth} />
            {/* Legend */}
            <div className="mt-6 text-xs text-black space-y-1">
              <div className="flex gap-2 items-center">
                  <div className="h-4 w-4 bg-green-300 border rounded"></div>
                  <span>Selected (O)</span>
              </div>
              <div className="flex gap-2 items-center">
                  <div className="h-4 w-4 bg-pink-300 border rounded"></div>
                  <span>Skipped (-)</span>
              </div>
              <div className="flex gap-2 items-center">
                  <div className="h-4 w-4 bg-gray-300 border rounded line-through text-black">X</div>
                  <span>Missing (X)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="my-6 pt-4 border-t border-gray-300 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            PPD Values
          </label>
          <PerioInput teeth={record.teeth} data={record.ppd} readonly />
        </div>
        <div className="my-6 pt-4 border-t border-gray-300 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            LGM Values
          </label>
          <PerioInput teeth={record.teeth} data={record.lgm} readonly />
        </div>
        <div className="my-6 pt-4 border-t border-gray-300 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Assigned Patient
          </label>
          { patient &&
            <PatientCard patient={patient} />
          }
        </div>
      </Card>
      <Card title="Paramaeter Entries">
        {record.paramEntries.map((entry) => (
          <EntryView
            key={entry.id}
            label={entry.label}
            teeth={record.teeth}
            entry={entry.entry}
            onEdit={onEditEntry(entry.id)}
          />
        ))}
        <div className="my-6 border-gray-300 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Create new parameter entry
          </label>
          <Button onClick={onEditEntry('new')} variant="outline" size="sm" className="text-xs sm:text-sm">
            + New Entry
          </Button>
        </div>
      </Card>

      <Card title="Record Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Created At
            </label>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDate(record.createdAt)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Last Updated
            </label>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDate(record.updatedAt)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Patient ID
            </label>
            <p className="text-sm font-mono text-gray-900 dark:text-white">
              {record.id}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

type EntryViewProps = {
  label: string;
  teeth: TeethSelection;
  entry: Quadrant<CommonMeasurement>;
  onEdit: () => void;
};
function EntryView({ label, teeth, entry, onEdit }: EntryViewProps) {
  return (
    <div className="my-6 pb-4 border-b border-gray-300 dark:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </label>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm mb-4" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Entry
        </Button>
      </div>
      <PerioInput teeth={teeth} data={entry} readonly />
    </div>
  );
}
