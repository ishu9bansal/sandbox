"use client";

import { useRef, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { PPDRecord, TeethSelection } from "@/models/perio";
import { dataUpdaterFromValues, deriveValues, deriveZones } from "./utils";
import PerioInput from "./PerioInput";

interface PPDFormProps {
  teeth: TeethSelection;
  data: PPDRecord;
  onSubmit: (updater: (data: PPDRecord) => PPDRecord) => void;
  onCancel: () => void;
}

export default function PPDForm({ data, teeth, onSubmit, onCancel }: PPDFormProps) {
  const [values, setValues] = useState<string[][]>(deriveValues(data));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updateData = dataUpdaterFromValues(values);
    onSubmit(updateData);
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
      <form ref={submitRef} onSubmit={handleSubmit} className="space-y-8">
        <PerioInput data={values} zones={deriveZones()} onUpdate={setValues} onNextFocus={handleFocusSubmit} />
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



