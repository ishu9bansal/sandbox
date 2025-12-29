"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import PerioRecordForm from "../components/PerioRecordForm";
import { addPerioRecord, PerioRecord } from "@/app/store/perioSlice";

export default function AddRecordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleAddRecord = (record: Omit<PerioRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(addPerioRecord(record));
    router.push('/periodontics');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PerioRecordForm
        onSubmit={handleAddRecord}
        onCancel={handleCancel}
      />
    </div>
  );
}
