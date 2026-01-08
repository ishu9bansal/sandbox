"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PerioRecordForm from "../../components/PerioRecordForm";
import { selectPerioRecordById, updatePerioRecord } from "@/store/slices/perioSlice";
import { PerioRecord } from '@/models/perio';
import { useCallback, useState } from "react";
import PatientForm from "../../components/PatientForm";
import useFormField from "@/hooks/useFormField";
import PerioInput from "../../components/input/PerioInput";
import EditLayout from "../../components/EditLayout";

type ViewType = 'basic' | 'ppd' | 'lgm' | 'patient';
const VIEW_ORDER: ViewType[] = ['basic', 'ppd', 'lgm', 'patient'];
const viewTitleMap: Record<ViewType, string> = {
  basic: 'Edit Record',
  ppd: 'Edit Pocket Probing Depth (PPD)',
  lgm: 'Edit Level of Gingival Margin (LGM)',
  patient: 'Assign to Patient',
};
const BACK = "Back";
const NEXT = "Next";
const CANCEL = "Cancel";
const SUBMIT = "Submit";

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
  const { view, handleBack, handleNext, backLabel, nextLabel } = useViewsNavigation(onCancel, onSubmit);
  const viewTitle = viewTitleMap[view];
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
  const commitFunctions: Record<ViewType, () => void> = {
    basic: commitBasicInfoUpdate,
    ppd: commitPpdUpdate,
    lgm: commitLgmUpdate,
    patient: commitPatientIdUpdate,
  };
  const commit = commitFunctions[view];
  const handleSubmit = useCallback(() => {
    commit();
    handleNext();
  }, [handleNext, commit]);

  // TODO: show progress indicator of which step we are on
  // TODO: is there a better way to manage multi-step forms, instead of conditional rendering?
  return (
    <div className="max-w-3xl mx-auto">
      <EditLayout
        title={viewTitle}
        onSubmit={handleSubmit}
        onCancel={handleBack}
        backLabel={backLabel}
        nextLabel={nextLabel}
      >
      { view === 'basic' &&
        <PerioRecordForm
          errors={null}
          label={basicInfo.label}
          note={basicInfo.note}
          onLabelChange={(label) => setBasicInfo(prev => ({ ...prev, label }))}
          onNoteChange={(note) => setBasicInfo(prev => ({ ...prev, note }))}
        />
      }
      { view === 'ppd' && <PerioInput data={ppd} onUpdate={setPpd} /> }
      { view === 'lgm' && <PerioInput data={lgm} onUpdate={setLgm} /> }
      { view === 'patient' &&
        <PatientForm patient_id={patientId} onChange={setPatientId} />
      }
      </EditLayout>
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
  const [backLabel, setBackLabel] = useState(BACK);
  const [nextLabel, setNextLabel] = useState(NEXT);
  const currentIndex = VIEW_ORDER.indexOf(view);
  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setView(VIEW_ORDER[currentIndex - 1]);
      setBackLabel(BACK);
    } else {
      onCancel();
      setBackLabel(CANCEL);
    }

  }, [onCancel, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < VIEW_ORDER.length - 1) {
      setView(VIEW_ORDER[currentIndex + 1]);
      setNextLabel(NEXT);
    } else {
      onSubmit();
      setNextLabel(SUBMIT);
    }
  }, [onSubmit, currentIndex]);

  return { view, handleBack, handleNext, backLabel, nextLabel };
}
