"use client";

import EditLayout from "@/app/periodontics/components/EditLayout";
import PerioInput from "@/app/periodontics/components/input/PerioInput";
import QuickLabels from "@/components/compositions/quick-labels";
import { SelectInput } from "@/components/compositions/select-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParamEntry, ParamType } from "@/models/perio";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPerioRecordById, updatePerioRecord } from "@/store/slices/perioSlice";
import { generateParamEntryId, newMeasure } from "@/utils/perio";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function PerioRecordEntryEditPage() {
  const { id: record_id, eid: entry_id } = useParams();
  const router = useRouter();
  const recordMaybe = useAppSelector(selectPerioRecordById(record_id));
  const record = recordMaybe!;  // already handled non-existence in layout.tsx
  const dispatch = useAppDispatch();
  const onSubmit = useCallback((entry: ParamEntry) => {
    const updatedParamEntries = [...record.paramEntries];
    const existingIndex = updatedParamEntries.findIndex(e => e.id === entry.id);
    if (existingIndex >= 0) {
      updatedParamEntries[existingIndex] = entry;
    } else {
      updatedParamEntries.push(entry);
    }
    dispatch(updatePerioRecord({
      ...record,
      paramEntries: updatedParamEntries,
    }));
  }, [dispatch, record]);
  const recordEntry = record.paramEntries.find(e => e.id === entry_id);
  const [label, setLabel] = useState(recordEntry ? recordEntry.label : '');
  const [type, setType] = useState('6 site');
  const [input, setInput] = useState(recordEntry ? recordEntry.entry : newMeasure());
  const viewTitle = recordEntry ? "Edit Entry" : "Add Entry";
  const handleSubmit = useCallback(() => {
    onSubmit({
      id: recordEntry ? recordEntry.id : generateParamEntryId(),
      type: type as ParamType,
      label,
      entry: input,
    });
    router.push(`/periodontics/${record_id}`);
  }, [label, input, onSubmit, router, record_id]);
  const handleDelete = useCallback(() => {
    if (recordEntry && window.confirm(`Are you sure you want to delete entry "${recordEntry.label}"?`)) {
      const updatedParamEntries = record.paramEntries.filter(e => e.id !== recordEntry.id);
      dispatch(updatePerioRecord({
        ...record,
        paramEntries: updatedParamEntries,
      }));
      router.push(`/periodontics/${record_id}`);
    }
  }, [dispatch, record, recordEntry, router, record_id]);
  const labels = ['PPD', 'LGM', 'Bleeding on Probing', 'Mobility', 'Furcation Involvement', 'Suppuration', 'Gingival Recession'];
  return (
    <div className="max-w-3xl mx-auto">
      <EditLayout
        title={viewTitle}
        onSubmit={handleSubmit}
        onCancel={router.back}
        nextLabel={'Submit'}
        actionChildren={recordEntry && <DeleteButton onDelete={handleDelete} />}
      >
        <div className="space-y-6 grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2">Parameter Name</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter parameter name"
            />
          </div>
          <div>
            <Label className="mb-2">Parameter Type</Label>
            <SelectInput value={type} onChange={setType} options={['6 site', '4 site']} />
          </div>
          <div className="col-span-2">
            <QuickLabels labels={labels} onSelect={setLabel} />
          </div>
          <div className="col-span-2">
            <PerioInput paramType={type as ParamType} teeth={record.teeth} data={input} onUpdate={setInput} />
          </div>
        </div>
      </EditLayout>
    </div>
  );
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <Button variant="destructive" onClick={onDelete} type="button">
      Delete Entry
    </Button>
  );
}
