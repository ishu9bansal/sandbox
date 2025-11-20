"use client";

import { Survey } from "@/components/Survey";
import { steps } from "./constants";

export default function CNGPage() {
  const handleSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Survey
        steps={steps}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
