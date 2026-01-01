"use client";

import { useRef, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { PPDRecord, TeethSelection } from "@/models/perio";
import { deriveDataFromValues, deriveValues, deriveZones } from "./utils";
import PerioInput from "./PerioInput";

interface PPDFormProps {
  teeth: TeethSelection;
  data: PPDRecord;
  onSubmit: (data: PPDRecord) => void;
  onCancel: () => void;
}

export default function PPDForm({ data, teeth, onSubmit, onCancel }: PPDFormProps) {
  const [values, setValues] = useState<string[][]>(deriveValues(data));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = deriveDataFromValues(values);
    onSubmit(updatedData);
  };
  const submitRef = useRef<HTMLFormElement>(null);
  const handleFocusSubmit = () => {
    const el = submitRef.current;
    if (el) {
      el.focus();
    }
  }
  return (
    <Card title={"Edit PPD Values"}>
      <form ref={submitRef} onSubmit={handleSubmit} className="space-y-4 overflow-x-auto">
        <div className="inline-block min-w-max">
          <PerioInput data={values} zones={deriveZones()} onUpdate={setValues} onNextFocus={handleFocusSubmit} />
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Back
          </Button>
          <Button variant="primary" type="submit">
            Next
          </Button>
        </div>
      </form>
    </Card>
  );
}



