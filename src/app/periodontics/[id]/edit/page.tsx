"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PerioRecordForm from "../../components/PerioRecordForm";
import { selectPerioRecordById, updatePerioRecord } from "@/store/slices/perioSlice";
import { PerioRecord } from '@/models/perio';
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
  const id = record?.id || '';
  const onCancel = useCallback(() => router.back(), [router]);
  const onSubmit = useCallback(() => router.push(`/periodontics/${id}`), [router, id]);
  const { view, handleBack, handleNext } = useViewsNavigation(onCancel, onSubmit);
  const handleUpdate = useCallback((updatedRecord: Partial<PerioRecord>) => {
    dispatch(updatePerioRecord({ ...updatedRecord, id }));
    handleNext();
  }, [dispatch, id, handleNext]);

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
  // TODO: move the submit/cancel buttons out of each form and into this page
  // TODO: refactor the button names to be Next/Back instead of Submit/Cancel
  // TODO: show progress indicator of which step we are on
  // TODO: is there a better way to manage multi-step forms, instead of conditional rendering?
  return (
    <div className="max-w-3xl mx-auto">
      { view === 'basic' &&
        <PerioRecordForm
          record={record}
          onSubmit={handleUpdate}
          onCancel={handleBack}
        />
      }
      { view === 'ppd' &&
        <PPDForm
          teeth={record.teeth}
          data={record.ppd}
          onSubmit={(ppd) => handleUpdate({ ppd })}
          onCancel={handleBack}
        />
      }
      { view === 'lgm' &&
        <LGMForm
          teeth={record.teeth}
          data={record.lgm}
          onSubmit={(lgm) => handleUpdate({ lgm })}
          onCancel={handleBack}
        />
      }
      { view === 'patient' &&
        <PatientForm
          patient_id={record.patientId}
          onSubmit={(patientId) => handleUpdate({ patientId })}
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
