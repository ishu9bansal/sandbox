"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import PerioRecordForm from "../../components/PerioRecordForm";
import { PerioRecord, selectPerioRecordById, updatePerioRecord } from "@/app/store/perioSlice";

export default function EditPatientPage() {
  const router = useRouter();
  const { id: record_id } = useParams();
  const dispatch = useAppDispatch();
  const record = useAppSelector(selectPerioRecordById(record_id));

  if (!record) {
    return ( 
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Record Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The record you're trying to edit doesn't exist.
        </p>
      </div>
    );
  }

  const handleUpdate = (newRecord: Omit<PerioRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedRecord: PerioRecord = {
      ...newRecord,
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };

    dispatch(updatePerioRecord(updatedRecord));
    router.push(`/periodontics/${record.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PerioRecordForm
        record={record}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </div>
  );
}
