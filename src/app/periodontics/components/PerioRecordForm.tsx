"use client";

import { useCallback } from "react";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface PerioRecordFormProps {
  title: string;
  info: { label: string; note: string };
  onChange: (info: { label: string; note: string }) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PerioRecordForm({ title, info, onChange, onSubmit, onCancel }: PerioRecordFormProps) {
  const onFieldChange = useCallback((field: string, value: string) => {
    onChange({ ...info, [field]: value });
  }, [info, onChange]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleLabelChange = (value: string) => onFieldChange('label', value);
  const handleNoteChange = (value: string) => onFieldChange('note', value);
  const labels = ['Baseline', 'Follow Up'];

  return (
    <Card title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Label"
            value={info.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Enter record label"
            required
          />
          <QuickLabels labels={labels} onSelect={handleLabelChange} />
          <Input
            label="Note"
            value={info.note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Enter any notes"
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