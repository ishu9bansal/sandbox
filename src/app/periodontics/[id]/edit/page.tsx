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
import useFormField from "@/hooks/useFormField";

type ViewType = 'basic' | 'ppd' | 'lgm' | 'patient';
const VIEW_ORDER: ViewType[] = ['basic', 'ppd', 'lgm', 'patient'];

export default function EditPatientPage() {
  const { id: record_id } = useParams();
  const record = useAppSelector(selectPerioRecordById(record_id));
  return record ? <RecordView record={record} /> : <EmptyRecordView />;
}

function RecordView({ record }: { record: PerioRecord }) {
  const { id } = record;
  const router = useRouter();
  const onCancel = useCallback(() => router.back(), [router]);
  const onSubmit = useCallback(() => router.push(`/periodontics/${id}`), [router, id]);
  const { view, handleBack, handleNext } = useViewsNavigation(onCancel, onSubmit);
  const dispatch = useAppDispatch();
  const handleUpdate = useCallback((updatedRecord: Partial<PerioRecord>) => {
    dispatch(updatePerioRecord({ ...updatedRecord, id }));
  }, [dispatch, id]);
  const {
    value: ppd, onChange: setPpd, handleUpdate: commitPpdUpdate
  } = useFormField(record.ppd, useCallback((ppd) => handleUpdate({ ppd }), [handleUpdate]));
  const {
    value: lgm, onChange: setLgm, handleUpdate: commitLgmUpdate
  } = useFormField(record.lgm, useCallback((lgm) => handleUpdate({ lgm }), [handleUpdate]));
  const {
    value: patientId, onChange: setPatientId, handleUpdate: commitPatientIdUpdate
  } = useFormField(record.patientId, useCallback((patientId) => handleUpdate({ patientId }), [handleUpdate]));
  const {
    value: basicInfo, onChange: setBasicInfo, handleUpdate: commitBasicInfoUpdate
  } = useFormField({ label: record.label, note: record.note }, useCallback(({ label, note }) => handleUpdate({ label, note }), [handleUpdate]));

  // TODO: move the submit/cancel buttons out of each form and into this page
  // TODO: refactor the button names to be Next/Back instead of Submit/Cancel
  // TODO: show progress indicator of which step we are on
  // TODO: is there a better way to manage multi-step forms, instead of conditional rendering?
  return (
    <div className="max-w-3xl mx-auto">
      { view === 'basic' &&
        <PerioRecordForm
          title="Edit record"
          info={basicInfo}
          onChange={setBasicInfo}
          onSubmit={() => {
            commitBasicInfoUpdate();
            handleNext();
          }}
          onCancel={handleBack}
        />
      }
      { view === 'ppd' &&
        <PPDForm
          data={ppd}
          onChange={setPpd}
          onSubmit={() => {
            commitPpdUpdate();
            handleNext();
          }}
          onCancel={handleBack}
        />
      }
      { view === 'lgm' &&
        <LGMForm
          data={lgm}
          onChange={setLgm}
          onSubmit={() => {
            commitLgmUpdate();
            handleNext();
          }}
          onCancel={handleBack}
        />
      }
      { view === 'patient' &&
        <PatientForm
          patient_id={patientId}
          onChange={setPatientId}
          onSubmit={() => {
            commitPatientIdUpdate();
            handleNext();
          }}
          onCancel={handleBack}
        />
      }
    </div>
  );
}

function EmptyRecordView() {
  return ( 
    <div className="max-w-2xl mx-auto text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Record Not Found</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        The record you're trying to edit doesn't exist.
      </p>
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
