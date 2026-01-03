"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PerioRecordForm from "../../components/PerioRecordForm";
import { selectPerioRecordById, updatePerioRecord } from "@/store/slices/perioSlice";
import { PerioRecord, LGMRecord, PPDRecord, TeethSelection } from '@/models/perio';
import { useState } from "react";
import PPDForm from "../../components/PPDForm";
import LGMForm from "../../components/LGMForm";
import PatientForm from "../../components/PatientForm";

export default function EditPatientPage() {
  const router = useRouter();
  const { id: record_id } = useParams();
  const dispatch = useAppDispatch();
  const record = useAppSelector(selectPerioRecordById(record_id));
  const [view, setView] = useState<'basic' | 'ppd' | 'lgm' | 'patient'>('ppd');

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

  const handleBasicUpdate = ({ label, note, teeth }: { label: string, note: string; teeth: TeethSelection; }) => {
    const updatedRecord: PerioRecord = {
      ...record,
      label,
      note,
      teeth,
    };
    dispatch(updatePerioRecord(updatedRecord));
    setView('ppd');
  };

  const handlePPDUpdate = (updater: (ppd: PPDRecord) => PPDRecord) => {
    const updatedRecord: PerioRecord = {
      ...record,
      ppd: updater(record.ppd),
    };
    dispatch(updatePerioRecord(updatedRecord));
    setView('lgm');
  };

  const handleLGMUpdate = (updater: (lgm: LGMRecord) => LGMRecord) => {
    const updatedRecord: PerioRecord = {
      ...record,
      lgm: updater(record.lgm),
    };
    dispatch(updatePerioRecord(updatedRecord));
    setView('patient')
  };
  
  const handlePatientUpdate = (patientId: string | null) => {
    const updatedRecord: PerioRecord = {
      ...record,
      patientId,
    };
    dispatch(updatePerioRecord(updatedRecord));
    router.push(`/periodontics/${record.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-3xl mx-auto">
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
      { view === 'patient' &&
        <PatientForm
          patient_id={record.patientId}
          onSubmit={handlePatientUpdate}
          onCancel={() => setView('lgm')}
        />
      }
    </div>
  );
}
