"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { generateDefaultTeeth } from "@/store/perioSlice";
import { PerioRecord } from '@/models/perio';

interface PerioRecordFormProps {
  record?: PerioRecord;
  onSubmit: (record: Omit<PerioRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function PerioRecordForm({ record, onSubmit, onCancel }: PerioRecordFormProps) {
  const [formData, setFormData] = useState({
    label: record?.label || '',
    note: record?.note || '',
    teeth: record?.teeth || generateDefaultTeeth(),
    ppd: record?.ppd || {},
    lgm: record?.lgm || {},
    patientId: record?.patientId || null,
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
  const handleLabelChange = (value: string) => handleChange('label', value);
  const handleNoteChange = (value: string) => handleChange('note', value);
  const labels = ['Baseline', 'Follow Up'];

  return (
    <Card title={record ? "Edit Record" : "Add New Record"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Label"
            value={formData.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Enter record label"
            error={errors.label}
            required
          />
          <QuickLabels labels={labels} onSelect={handleLabelChange} />
          <Input
            label="Note"
            value={formData.note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Enter any notes"
            error={errors.note}
            type="textarea"
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

function QuickLabels({ labels, onSelect }: { labels: string[]; onSelect: (label: string) => void }) {
  return (
    <div className="mt-2 flex gap-2">
      {labels.map((label) => (
        <button
          key={label}
          type="button"
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => onSelect(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}