"use client";

import { useRef, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { LGM, Teeth } from "@/models/perio";
import PerioInput from "./PerioInput";
import { deriveDataFromValues, deriveValues, deriveZones } from "./utils";
import { LGMMapping } from "./constants";

interface LGMFormProps {
  teeth: Teeth;
  data: LGM;
  onSubmit: (data: LGM) => void;
  onCancel: () => void;
}


export default function LGMForm({ data, teeth, onSubmit, onCancel }: LGMFormProps) {
  const [values, setValues] = useState<string[][]>(deriveValues(data, LGMMapping));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = deriveDataFromValues(values, LGMMapping);
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
    <Card title={"Edit LGM Values" }>
      <form ref={submitRef} onSubmit={handleSubmit} className="space-y-4 overflow-x-auto">
        <div className="inline-block min-w-max">
          <PerioInput data={values} zones={deriveZones(LGMMapping[0])} onUpdate={setValues} onNextFocus={handleFocusSubmit} />
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
