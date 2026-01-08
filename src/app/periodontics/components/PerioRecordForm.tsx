"use client";

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
