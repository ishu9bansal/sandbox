"use client";

import Card from "@/components/Card";
import Button from "@/components/Button";
import { PerioRecord } from '@/models/perio';
import TeethVisualization from "@/components/TeethVisualization";
import PerioInput from "./input/PerioInput";
import { deriveValues, deriveZones } from "./input/utils";
import PatientCard from "@/app/patients/components/PatientCard";
import { useSelector } from "react-redux";
import { selectPatientById } from "@/store/slices/patientSlice";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Record Details</h2>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onBack}>
            ← Back to List
          </Button>
          <Button variant="outline" onClick={onEdit}>
            Edit Record
          </Button>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            Delete Record
          </button>
        </div>
      </div>

      <Card title="Clinical Data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Label
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
          <TeethVisualization data={record.teeth} />
          {/* Legend */}
          <div className="mt-6 text-xs text-white space-y-1">
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
        <div className="my-6 pt-4 border-t border-gray-300 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            PPD Values
          </label>
          <PerioInput data={deriveValues(record.ppd)} disabled={true} />
        </div>
        <div className="my-6 pt-4 border-t border-gray-300 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            LGM Values
          </label>
          <PerioInput data={deriveValues(record.lgm)} disabled={true} />
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
