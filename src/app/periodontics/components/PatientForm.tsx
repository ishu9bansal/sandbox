"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { LGM, Teeth } from "@/app/store/perioSlice";

interface PatientFormProps {
  onSubmit: (patient_id: string) => void;
  onCancel: () => void;
}

export default function PatientForm({ onSubmit, onCancel }: PatientFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit("");
  };

  return (
    <Card title={"Assign to Patient" }>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* Patient Select View */}
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
