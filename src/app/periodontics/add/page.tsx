"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PerioRecordForm from "../components/PerioRecordForm";
import { addPerioRecord, resetFreshId, selectFreshPerioRecordId } from "@/store/slices/perioSlice";
import { PerioRecord } from '@/models/perio';
import { useCallback, useEffect } from "react";
import { generateNewRecord } from "@/utils/perio";
import useFormField from "@/hooks/useFormField";
import { ModelInput } from "@/models/type";

export default function AddRecordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const freshId = useAppSelector(selectFreshPerioRecordId);
  const validate = useCallback((record: ModelInput<PerioRecord>) => {
    const errors: Record<string, string> = {};
    if (!record.label.trim()) {
      errors.label = 'Label is required';
    }
    return (Object.keys(errors).length > 0) ? errors : null;
  }, []);
  const handleAddRecord = useCallback((record: ModelInput<PerioRecord>) => {
    dispatch(addPerioRecord(record));
  }, [dispatch]);
  const {
    value: record, errors, onChange: setRecord, handleUpdate: commitRecordUpdate
  } = useFormField(generateNewRecord(), handleAddRecord, validate);

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    if (freshId) {
      router.replace(`/periodontics/${freshId}/edit`);
      dispatch(resetFreshId());
    }
  }, [freshId]);

  return (
    <div className="max-w-2xl mx-auto">
      <PerioRecordForm
        title="Add new record"
        errors={errors}
        label={record.label}
        note={record.note}
        onLabelChange={(label) => setRecord(prev => ({ ...prev, label }))}
        onNoteChange={(note) => setRecord(prev => ({ ...prev, note }))}
        onSubmit={() => {
          if (!commitRecordUpdate()) {
            console.log("Validation failed, cannot submit.");
          }
        }}
        onCancel={handleCancel}
      />
    </div>
  );
}
