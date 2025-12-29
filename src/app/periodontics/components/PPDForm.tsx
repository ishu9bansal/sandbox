"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { PPD, Teeth } from "@/app/store/perioSlice";

interface PPDFormProps {
  teeth: Teeth;
  data: PPD;
  onSubmit: (data: PPD) => void;
  onCancel: () => void;
}

export default function PPDForm({ data, teeth, onSubmit, onCancel }: PPDFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({});
  };

  return (
    <Card title={"Edit PPD Values" }>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* Quick Input for PPD values */}
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
