"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PerioRecordForm from "../../components/PerioRecordForm";
import { selectPerioRecordById, updatePerioRecord } from "@/store/slices/perioSlice";
import { PerioRecord, LGMRecord, PPDRecord, TeethSelection } from '@/models/perio';
import { useCallback, useState } from "react";
import PPDForm from "../../components/PPDForm";
import LGMForm from "../../components/LGMForm";
import PatientForm from "../../components/PatientForm";

type ViewType = 'basic' | 'ppd' | 'lgm' | 'patient';
const VIEW_ORDER: ViewType[] = ['basic', 'ppd', 'lgm', 'patient'];

export default function EditPatientPage() {
  const router = useRouter();
  const { id: record_id } = useParams();
  const dispatch = useAppDispatch();
  const record = useAppSelector(selectPerioRecordById(record_id));
  const onCancel = useCallback(() => {
    router.back();
  }, [router]);
  const onSubmit = useCallback(() => {
    router.push(`/periodontics/${record?.id}`);
  }, [router, record]);

  const { view, handleBack, handleNext } = useViewsNavigation(onCancel, onSubmit);

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
    handleNext();
  };

  const handlePPDUpdate = (ppd: PPDRecord) => {
    const updatedRecord: PerioRecord = {
      ...record,
      ppd,
    };
    dispatch(updatePerioRecord(updatedRecord));
    handleNext();
  };

  const handleLGMUpdate = (lgm: LGMRecord) => {
    const updatedRecord: PerioRecord = {
      ...record,
      lgm,
    };
    dispatch(updatePerioRecord(updatedRecord));
    handleNext();
  };
  
  const handlePatientUpdate = (patientId: string | null) => {
    const updatedRecord: PerioRecord = {
      ...record,
      patientId,
    };
    dispatch(updatePerioRecord(updatedRecord));
    handleNext();
  };


  return (
    <div className="max-w-3xl mx-auto">
      { view === 'basic' &&
        <PerioRecordForm
          record={record}
          onSubmit={handleBasicUpdate}
          onCancel={handleBack}
        />
      }
      { view === 'ppd' &&
        <PPDForm
          teeth={record.teeth}
          data={record.ppd}
          onSubmit={handlePPDUpdate}
          onCancel={handleBack}
        />
      }
      { view === 'lgm' &&
        <LGMForm
          teeth={record.teeth}
          data={record.lgm}
          onSubmit={handleLGMUpdate}
          onCancel={handleBack}
        />
      }
      { view === 'patient' &&
        <PatientForm
          patient_id={record.patientId}
          onSubmit={handlePatientUpdate}
          onCancel={handleBack}
        />
      }
    </div>
  );
}


function useViewsNavigation(onCancel: () => void, onSubmit: () => void) {
  const [view, setView] = useState<ViewType>('ppd');
  const currentIndex = VIEW_ORDER.indexOf(view);
  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setView(VIEW_ORDER[currentIndex - 1]);
    } else {
      onCancel();
    }
  }, [onCancel, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < VIEW_ORDER.length - 1) {
      setView(VIEW_ORDER[currentIndex + 1]);
    } else {
      onSubmit();
    }
  }, [onSubmit, currentIndex]);

  return { view, handleBack, handleNext };
}
