import { Patient } from '@/models/patient';
import Card from "@/components/Card";

export default function PatientCard({ patient }: { patient: Patient }) {
  return (
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
  );
}