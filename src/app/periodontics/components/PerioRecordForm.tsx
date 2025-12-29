"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { generateDefaultTeeth, PerioRecord } from "@/app/store/perioSlice";

interface PerioRecordFormProps {
  record?: PerioRecord;
  onSubmit: (patient: Omit<PerioRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function PerioRecordForm({ record, onSubmit, onCancel }: PerioRecordFormProps) {
  const [formData, setFormData] = useState({
    label: record?.label || '',
    teeth: record?.teeth || generateDefaultTeeth(),
    ppd: record?.ppd || {},
    lgm: record?.lgm || {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) {
      newErrors.name = 'Label is required';
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
    <Card title={record ? "Edit Record" : "Add New Record"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Label"
            value={formData.label}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="Enter record label"
            error={errors.label}
            required
          />
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Next
          </Button>
        </div>
      </form>
    </Card>
  );
}
