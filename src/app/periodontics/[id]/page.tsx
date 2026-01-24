"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PerioRecordDetails from "../components/PerioRecordDetails";
import { deletePerioRecord, selectPerioRecordById } from "@/store/slices/perioSlice";

export default function PerioRecordPage() {
  const router = useRouter();
  const { id: record_id } = useParams();
  const dispatch = useAppDispatch();
  const recordMaybe = useAppSelector(selectPerioRecordById(record_id));
  const record = recordMaybe!;  // already handled non-existence in layout.tsx

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
    <div className="max-w-5xl mx-auto">
      <PerioRecordDetails
        record={record}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}
