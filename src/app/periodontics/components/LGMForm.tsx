"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { LGM, Teeth } from "@/app/store/perioSlice";

interface LGMFormProps {
  teeth: Teeth;
  data: LGM;
  onSubmit: (data: LGM) => void;
  onCancel: () => void;
}

export default function LGMForm({ data, teeth, onSubmit, onCancel }: LGMFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({});
  };

  return (
    <Card title={"Edit LGM Values" }>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* Quick Input for LGM values */}
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Back
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Card>
  );
}
