"use client";

import Card from "@/components/Card";
import Button from "@/components/Button";
import { Patient } from "@/app/store/patientSlice";

interface PatientDetailsProps {
  patient: Patient;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export default function PatientDetails({ patient, onEdit, onDelete, onBack }: PatientDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Patient Details</h2>
        <Button variant="outline" onClick={onBack}>
          ← Back to List
        </Button>
      </div>

      <Card title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Name
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {patient.name}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Age
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {patient.age} years
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Sex
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {patient.sex}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Contact
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {patient.contact}
            </p>
          </div>

          {patient.email && (
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Email
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {patient.email}
              </p>
            </div>
          )}

          {patient.address && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Address
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {patient.address}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Record Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Created At
            </label>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDate(patient.createdAt)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Last Updated
            </label>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDate(patient.updatedAt)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Patient ID
            </label>
            <p className="text-sm font-mono text-gray-900 dark:text-white">
              {patient.id}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onEdit}>
          Edit Patient
        </Button>
        <button
          onClick={onDelete}
          className="px-4 py-2 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
        >
          Delete Patient
        </button>
      </div>
    </div>
  );
}
