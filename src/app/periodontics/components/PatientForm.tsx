"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Patient } from "@/app/store/patientSlice";

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    age: patient?.age || 0,
    sex: patient?.sex || 'Male' as const,
    contact: patient?.contact || '',
    email: patient?.email || '',
    address: patient?.address || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.age < 0 || formData.age > 150) {
      newErrors.age = 'Age must be between 0 and 150';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Card title={patient ? "Edit Patient" : "Add New Patient"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter patient name"
            error={errors.name}
            required
          />
        </div>

        <div>
          <Input
            label="Age"
            type="number"
            value={formData.age.toString()}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            placeholder="Enter patient age"
            error={errors.age}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sex
          </label>
          <select
            value={formData.sex}
            onChange={(e) => handleChange('sex', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <Input
            label="Contact"
            value={formData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            placeholder="Enter contact number"
            error={errors.contact}
            required
          />
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter email (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter address (optional)"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {patient ? "Update Patient" : "Add Patient"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
