"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PerioRecordForm from "../../components/PerioRecordForm";
import { selectPerioRecordById, updatePerioRecord } from "@/store/slices/perioSlice";
import { PerioRecord } from '@/models/perio';
import { useCallback, useMemo } from "react";
import PatientForm from "../../components/PatientForm";
import useFormField from "@/hooks/useFormField";
import PerioInput from "../../components/input/PerioInput";
import EditLayout from "../../components/EditLayout";
import { Survey, SurveyView, SurveyViewProxy, useSurveyContext } from "../../components/SurveyView";

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
  
  const {
    ppd, setPpd, commitPpd,
    lgm, setLgm, commitLgm,
    patientId, setPatientId, commitPatientId,
    basicInfo, setBasicInfo, commitBasicInfo,
  } = useFormFieldGroups(record);

  const commitFunctions = useMemo(() => ({
    basic: commitBasicInfo,
    ppd: commitPpd,
    lgm: commitLgm,
    patient: commitPatientId,
  }), [commitBasicInfo, commitLgm, commitPatientId, commitPpd]);

  // TODO: show progress indicator of which step we are on
  // TODO: is there a better way to manage multi-step forms, instead of conditional rendering?
  return (
    <div className="max-w-3xl mx-auto">
    <Survey defaultViewIndex={3}>
      <SurveyContextHandler
        onCancel={onCancel}
        onSubmit={onSubmit}
        commitFunctions={commitFunctions}
      >
        <SurveyViewProxy />
      </SurveyContextHandler>
      <SurveyView id="basic">
        <PerioRecordForm
          errors={null}
          label={basicInfo.label}
          note={basicInfo.note}
          onLabelChange={(label) => setBasicInfo(prev => ({ ...prev, label }))}
          onNoteChange={(note) => setBasicInfo(prev => ({ ...prev, note }))}
        />
      </SurveyView>
      <SurveyView id="ppd">
        <PerioInput data={ppd} onUpdate={setPpd} />
      </SurveyView>
      <SurveyView id="lgm">
        <PerioInput data={lgm} onUpdate={setLgm} />
      </SurveyView>
      <SurveyView id="patient">
        <PatientForm patient_id={patientId} onChange={setPatientId} />
      </SurveyView>
    </Survey>
    </div>
  );
}

type SurveyContextHandlerProps = {
  children: React.ReactNode;
  onCancel: () => void;
  onSubmit: () => void;
  commitFunctions: Record<ViewType, () => void>;
};
function SurveyContextHandler({ children, onCancel, onSubmit, commitFunctions }: SurveyContextHandlerProps) {
  const { currentViewId, prevViewId, nextViewId, onNextView, onPrevView } = useSurveyContext();
  const view = VIEW_ORDER.find(v => v === currentViewId) || null;
  const viewTitle = view ? viewTitleMap[view] : "";
  const backLabel = prevViewId ? BACK : CANCEL;
  const nextLabel = nextViewId ? NEXT : SUBMIT;
  const handleBack = prevViewId ? onPrevView : onCancel;
  const handleNext = nextViewId ? onNextView : onSubmit;
  const commit = view && commitFunctions[view] ? commitFunctions[view] : () => {};
  const handleSubmit = useCallback(() => {
    commit();
    handleNext();
  }, [handleNext, commit]);
  return (
    <EditLayout
        title={viewTitle}
        onSubmit={handleSubmit}
        onCancel={handleBack}
        backLabel={backLabel}
        nextLabel={nextLabel}
      >
      {children}
    </EditLayout>
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

function useFormFieldGroups(record: PerioRecord) {
  const { id } = record;
  const dispatch = useAppDispatch();
  const handleUpdate = useCallback((updatedRecord: Partial<PerioRecord>) => {
    dispatch(updatePerioRecord({ ...updatedRecord, id }));
  }, [dispatch, id]);
  const {
    value: ppd, onChange: setPpd, handleUpdate: commitPpd
  } = useFormField(record.ppd, useCallback((ppd) => handleUpdate({ ppd }), [handleUpdate]));
  const {
    value: lgm, onChange: setLgm, handleUpdate: commitLgm
  } = useFormField(record.lgm, useCallback((lgm) => handleUpdate({ lgm }), [handleUpdate]));
  const {
    value: patientId, onChange: setPatientId, handleUpdate: commitPatientId
  } = useFormField(record.patientId, useCallback((patientId) => handleUpdate({ patientId }), [handleUpdate]));
  const {
    value: basicInfo, onChange: setBasicInfo, handleUpdate: commitBasicInfo
  } = useFormField({ label: record.label, note: record.note }, useCallback(({ label, note }) => handleUpdate({ label, note }), [handleUpdate]));
  return {
    ppd, setPpd, commitPpd,
    lgm, setLgm, commitLgm,
    patientId, setPatientId, commitPatientId,
    basicInfo, setBasicInfo, commitBasicInfo,
  };
}
