"use client";

import { useRef, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { LGMRecord, TeethSelection } from "@/models/perio";
import PerioInput from "./PerioInput";
import { dataUpdaterFromValues, deriveValues, deriveZones } from "./utils";

interface LGMFormProps {
  teeth: TeethSelection;
  data: LGMRecord;
  onSubmit: (updater: (data: LGMRecord) => LGMRecord) => void;
  onCancel: () => void;
}


export default function LGMForm({ data, teeth, onSubmit, onCancel }: LGMFormProps) {
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
    <Card title={"Edit LGM Values" }>
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
