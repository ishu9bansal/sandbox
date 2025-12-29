"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import PerioRecordForm from "../components/PerioRecordForm";
import { addPerioRecord, PerioRecord, resetFreshId, selectFreshPerioRecordId } from "@/app/store/perioSlice";
import { useEffect } from "react";

export default function AddRecordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const freshId = useAppSelector(selectFreshPerioRecordId);

  const handleAddRecord = (record: Omit<PerioRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(addPerioRecord(record));
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
        onSubmit={handleAddRecord}
        onCancel={handleCancel}
      />
    </div>
  );
}
