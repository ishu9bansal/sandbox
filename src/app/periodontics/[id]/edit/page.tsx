"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import PerioRecordForm from "../../components/PerioRecordForm";
import { LGM, PerioRecord, PPD, selectPerioRecordById, updatePerioRecord } from "@/app/store/perioSlice";
import { useState } from "react";
import PPDForm from "../../components/PPDForm";
import LGMForm from "../../components/LGMForm";

export default function EditPatientPage() {
  const router = useRouter();
  const { id: record_id } = useParams();
  const dispatch = useAppDispatch();
  const record = useAppSelector(selectPerioRecordById(record_id));
  const [view, setView] = useState<'basic' | 'ppd' | 'lgm'>('ppd');

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

  const handleBasicUpdate = (newRecord: Omit<PerioRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedRecord: PerioRecord = {
      ...newRecord,
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
    dispatch(updatePerioRecord(updatedRecord));
    setView('ppd');
  };

  const handlePPDUpdate = (newData: PPD) => {
    const updatedRecord: PerioRecord = {
      ...record,
      ppd: newData,
    };
    dispatch(updatePerioRecord(updatedRecord));
    setView('lgm');
  };

  const handleLGMUpdate = (newData: LGM) => {
    const updatedRecord: PerioRecord = {
      ...record,
      lgm: newData,
    };
    dispatch(updatePerioRecord(updatedRecord));
    router.push(`/periodontics/${record.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto">
      { view === 'basic' &&
        <PerioRecordForm
          record={record}
          onSubmit={handleBasicUpdate}
          onCancel={handleCancel}
        />
      }
      { view === 'ppd' &&
        <PPDForm
          teeth={record.teeth}
          data={record.ppd}
          onSubmit={handlePPDUpdate}
          onCancel={() => setView('basic')}
        />
      }
      { view === 'lgm' &&
        <LGMForm
          teeth={record.teeth}
          data={record.lgm}
          onSubmit={handleLGMUpdate}
          onCancel={() => setView('ppd')}
        />
      }
    </div>
  );
}
