"use client";

import EditLayout from "@/app/periodontics/components/EditLayout";
import PerioInput from "@/app/periodontics/components/input/PerioInput";
import CustomSitesSelector from "@/app/periodontics/components/input/CustomSitesSelector";
import QuickLabels from "@/components/compositions/quick-labels";
import { SelectInput } from "@/components/compositions/select-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSitesConfig, ParamEntry, ParamType } from "@/models/perio";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPerioRecordById, updatePerioRecord } from "@/store/slices/perioSlice";
import { generateParamEntryId, get6SiteConfig, get4SiteConfig, detectPresetType, newMeasure } from "@/utils/perio";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function PerioRecordEntryEditPage() {
  const { id: record_id, eid: entry_id } = useParams();
  const router = useRouter();
  const recordMaybe = useAppSelector(selectPerioRecordById(record_id));
  const record = recordMaybe!;  // already handled non-existence in layout.tsx
  const dispatch = useAppDispatch();
  const onSubmit = useCallback((entry: ParamEntry) => {
    const updatedParamEntries = [...record.paramEntries];
    const existingIndex = updatedParamEntries.findIndex(e => e.id === entry.id);
    if (existingIndex >= 0) {
      updatedParamEntries[existingIndex] = entry;
    } else {
      updatedParamEntries.push(entry);
    }
    dispatch(updatePerioRecord({
      ...record,
      paramEntries: updatedParamEntries,
    }));
  }, [dispatch, record]);
  
  const recordEntry = record.paramEntries.find(e => e.id === entry_id);
  const [label, setLabel] = useState(recordEntry ? recordEntry.label : '');
  
  // Initialize sitesConfig from existing entry or default to 6-site
  const [sitesConfig, setSitesConfig] = useState<CustomSitesConfig>(
    recordEntry?.sitesConfig || get6SiteConfig()
  );
  
  // Type is derived from sitesConfig
  const [type, setType] = useState<ParamType>(
    recordEntry ? recordEntry.type : '6 site'
  );
  
  const [input, setInput] = useState(recordEntry ? recordEntry.entry : newMeasure());
  const viewTitle = recordEntry ? "Edit Entry" : "Add Entry";
  
  // Update type when sitesConfig changes (grid changes)
  useEffect(() => {
    const detectedType = detectPresetType(sitesConfig);
    setType(detectedType);
  }, [sitesConfig]);
  
  // Update sitesConfig when type changes (dropdown changes)
  const handleTypeChange = (newType: ParamType) => {
    if (newType === '6 site') {
      setSitesConfig(get6SiteConfig());
    } else if (newType === '4 site') {
      setSitesConfig(get4SiteConfig());
    }
    // If 'custom', keep current sitesConfig
    setType(newType);
  };
  
  const handleSubmit = useCallback(() => {
    onSubmit({
      id: recordEntry ? recordEntry.id : generateParamEntryId(),
      type: type,
      label,
      entry: input,
      sitesConfig: sitesConfig,
    });
    router.push(`/periodontics/${record_id}`);
  }, [label, input, type, sitesConfig, onSubmit, router, record_id, recordEntry]);
  
  const handleDelete = useCallback(() => {
    if (recordEntry && window.confirm(`Are you sure you want to delete entry "${recordEntry.label}"?`)) {
      const updatedParamEntries = record.paramEntries.filter(e => e.id !== recordEntry.id);
      dispatch(updatePerioRecord({
        ...record,
        paramEntries: updatedParamEntries,
      }));
      router.push(`/periodontics/${record_id}`);
    }
  }, [dispatch, record, recordEntry, router, record_id]);
  
  const labels = ['PPD', 'LGM', 'Bleeding on Probing', 'Mobility', 'Furcation Involvement', 'Suppuration', 'Gingival Recession'];
  
  return (
    <div className="max-w-3xl mx-auto">
      <EditLayout
        title={viewTitle}
        onSubmit={handleSubmit}
        onCancel={router.back}
        nextLabel={'Submit'}
        actionChildren={recordEntry && <DeleteButton onDelete={handleDelete} />}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Parameter Name</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter parameter name"
              />
            </div>
            <div className="col-span-2">
              <Label className="mb-2">Preset Names</Label>
              <QuickLabels labels={labels} onSelect={setLabel} />
            </div>
            <div>
              <CustomSitesSelector config={sitesConfig} onChange={setSitesConfig} />
            </div>
            <div>
              <Label className="mb-2">Preset Site Selection</Label>
              <SelectInput 
                value={type} 
                onChange={(value) => handleTypeChange(value as ParamType)} 
                options={['6 site', '4 site', 'custom']} 
              />
            </div>
          </div>
          
          
          <div>
            <PerioInput
              teeth={record.teeth} 
              data={input} 
              onUpdate={setInput} 
              customSitesConfig={sitesConfig}
            />
          </div>
        </div>
      </EditLayout>
    </div>
  );
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <Button variant="destructive" onClick={onDelete} type="button">
      Delete Entry
    </Button>
  );
}
