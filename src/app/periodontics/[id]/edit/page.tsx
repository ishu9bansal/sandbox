"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PerioRecordForm from "../../components/PerioRecordForm";
import { selectPerioRecordById, updatePerioRecord } from "@/store/slices/perioSlice";
import { PerioRecord } from '@/models/perio';
import { useCallback, useState } from "react";
import PatientForm from "../../components/PatientForm";
import useFormField from "@/hooks/useFormField";
import EditLayout from "../../components/EditLayout";
import TeethVisualization from "@/components/TeethVisualization";

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
  
  const {
    patientId, setPatientId, commitPatientId,
    basicInfo, setBasicInfo, commitBasicInfo,
    teeth, setTeeth, commitTeeth,
  } = useFormFieldGroups(record);

  const commitFunctions: Record<ViewType, () => void> = {
    basic: commitBasicInfo,
    teeth: commitTeeth,
    patient: commitPatientId,
  };
  const commit = commitFunctions[view];
  const handleSubmit = useCallback(() => {
    commit();
    handleNext();
  }, [handleNext, commit]);

  // TODO: show progress indicator of which step we are on
  // TODO: is there a better way to manage multi-step forms, instead of conditional rendering?
  return (
    <div className="max-w-4xl mx-auto">
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
      { view === 'teeth' && <TeethVisualization data={teeth} onChange={setTeeth} /> }
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

type ViewType = 'basic' | 'patient' | 'teeth';
const VIEW_ORDER: ViewType[] = ['basic', 'teeth', 'patient'];
const viewTitleMap: Record<ViewType, string> = {
  basic: 'Edit Record',
  teeth: 'Select Missing Teeth',
  patient: 'Assign to Patient',
};
const BACK = "Back";
const NEXT = "Next";
const CANCEL = "Cancel";
const SUBMIT = "Submit";

function useViewsNavigation(onCancel: () => void, onSubmit: () => void) {
  const [view, setView] = useState<ViewType>('teeth');
  const currentIndex = VIEW_ORDER.indexOf(view);
  const prevView = currentIndex > 0 ? VIEW_ORDER[currentIndex - 1] : null;
  const nextView = currentIndex < VIEW_ORDER.length - 1 ? VIEW_ORDER[currentIndex + 1] : null;
  const handleBack = prevView ? () => setView(prevView) : onCancel;
  const handleNext = nextView ? () => setView(nextView) : onSubmit;
  const backLabel = prevView ? BACK : CANCEL;
  const nextLabel = nextView ? NEXT : SUBMIT;
  return { view, handleBack, handleNext, backLabel, nextLabel };
}

function useFormFieldGroups(record: PerioRecord) {
  const { id } = record;
  const dispatch = useAppDispatch();
  const handleUpdate = useCallback((updatedRecord: Partial<PerioRecord>) => {
    dispatch(updatePerioRecord({ ...updatedRecord, id }));
  }, [dispatch, id]);
  const {
    value: patientId, onChange: setPatientId, handleUpdate: commitPatientId
  } = useFormField(record.patientId, useCallback((patientId) => handleUpdate({ patientId }), [handleUpdate]));
  const {
    value: basicInfo, onChange: setBasicInfo, handleUpdate: commitBasicInfo
  } = useFormField({ label: record.label, note: record.note }, useCallback(({ label, note }) => handleUpdate({ label, note }), [handleUpdate]));
  const {
    value: teeth, onChange: setTeeth, handleUpdate: commitTeeth
  } = useFormField(record.teeth, useCallback((teeth) => handleUpdate({ teeth }), [handleUpdate]));
  return {
    patientId, setPatientId, commitPatientId,
    basicInfo, setBasicInfo, commitBasicInfo,
    teeth, setTeeth, commitTeeth,
  };
}
