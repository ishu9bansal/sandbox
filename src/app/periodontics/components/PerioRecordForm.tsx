"use client";

import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface PerioRecordFormProps {
  title: string;
  errors: Record<string, string> | null;
  label: string;
  note: string;
  onLabelChange: (label: string) => void;
  onNoteChange: (note: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PerioRecordForm({
  title,
  errors,
  label,
  note,
  onLabelChange,
  onNoteChange,
  onSubmit,
  onCancel,
}: PerioRecordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  const labels = ['Baseline', 'Follow Up'];

  return (
    <Card title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
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