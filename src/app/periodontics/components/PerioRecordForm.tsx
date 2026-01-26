"use client";

import QuickLabels from "@/components/compositions/quick-labels";
import Input from "@/components/Input";

interface PerioRecordFormProps {
  errors: Record<string, string> | null;
  label: string;
  note: string;
  onLabelChange: (label: string) => void;
  onNoteChange: (note: string) => void;
}

export default function PerioRecordForm({
  errors,
  label,
  note,
  onLabelChange,
  onNoteChange,
}: PerioRecordFormProps) {
  const labels = ['Baseline', 'Follow Up'];
  return (
    <div>
      <Input
        label="Label"
        value={label}
        onChange={(e) => onLabelChange(e.target.value)}
        placeholder="Enter record label"
        error={errors?.label}
      />
      <QuickLabels labels={labels} onSelect={onLabelChange} />
      <Input
        label="Note"
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Enter any notes"
        type="textarea"
      />
    </div>
  );
}
