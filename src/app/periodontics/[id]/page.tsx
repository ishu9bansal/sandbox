"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Button from "@/components/Button";
import PerioRecordDetails from "../components/PerioRecordDetails";
import { deletePerioRecord, selectPerioRecordById } from "@/store/slices/perioSlice";

export default function PerioRecordPage() {
  const router = useRouter();
  const { id: record_id } = useParams();
  const dispatch = useAppDispatch();
  const record = useAppSelector(selectPerioRecordById(record_id));

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Record Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The record you're looking for doesn't exist.
        </p>
        <Button variant="primary" onClick={() => router.push('/periodontics')}>
          Back to Record List
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${record.label}?`)) {
      dispatch(deletePerioRecord(record.id));
      router.push('/periodontics');
    }
  };

  const handleEdit = () => {
    router.push(`/periodontics/${record.id}/edit`);
  };

  const handleBack = () => {
    router.push(`/periodontics`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PerioRecordDetails
        record={record}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}
