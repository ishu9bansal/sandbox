"use client";

import { useRef } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { PPDRecord } from "@/models/perio";
import PerioInput from "./input/PerioInput";

interface PPDFormProps {
  data: PPDRecord;
  onChange: (data: PPDRecord) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PPDForm({ data, onChange, onSubmit, onCancel }: PPDFormProps) {
  const submitRef = useRef<HTMLFormElement>(null);
  const handleFocusSubmit = () => {
    const el = submitRef.current;
    if (el) {
      el.focus();
    }
  }
  return (
    <Card title={"Edit PPD Values"}>
      <form ref={submitRef} onSubmit={onSubmit} className="space-y-8">
        <PerioInput data={data} onUpdate={onChange} onNextFocus={handleFocusSubmit} />
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



