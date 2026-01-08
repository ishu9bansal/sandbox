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
  const handleAddRecord = useCallback((record: ModelInput<PerioRecord>) => {
    dispatch(addPerioRecord(record));
  }, [dispatch]);
  const {
    value: record, onChange: setRecord, handleUpdate: commitRecordUpdate
  } = useFormField(generateNewRecord(), handleAddRecord);

  const onChange = (updatedInfo: { label: string; note: string }) => {
    setRecord(prev => ({ ...prev, ...updatedInfo }));
  };

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
        info={{ label: record.label, note: record.note }}
        onChange={onChange}
        onSubmit={commitRecordUpdate}
        onCancel={handleCancel}
      />
    </div>
  );
}
