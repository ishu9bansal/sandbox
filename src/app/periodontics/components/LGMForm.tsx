"use client";

import { useRef, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { LGMRecord, TeethSelection } from "@/models/perio";
import PerioInput from "./input/PerioInput";

interface LGMFormProps {
  data: LGMRecord;
  onChange: (data: LGMRecord) => void;
  onSubmit: () => void;
  onCancel: () => void;
}


export default function LGMForm({ data, onChange, onSubmit, onCancel }: LGMFormProps) {
  const submitRef = useRef<HTMLFormElement>(null);
  const handleFocusSubmit = () => {
    const el = submitRef.current;
    if (el) {
      el.focus();
    }
  }
  return (
    <Card title={"Edit LGM Values" }>
      <form ref={submitRef} onSubmit={onSubmit} className="space-y-4 overflow-x-auto">
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
