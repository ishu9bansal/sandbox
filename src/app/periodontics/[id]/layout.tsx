"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectPerioRecordById } from "@/store/slices/perioSlice";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { id: record_id } = useParams();
  const record = useAppSelector(selectPerioRecordById(record_id));

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Record Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The record you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.push('/periodontics')}>
          Back to Record List
        </Button>
      </div>
    );
  }

  return children;
}
