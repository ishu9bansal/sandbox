"use client";

import { Survey } from "@/components/Survey";
import { type Step } from "@/components/Survey/types";

// TODO: create steps for the CNG survey
const steps: Step[] = [];

export default function CNGPage() {
  const handleSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Survey
        steps={[
          {
            id: "step1",
            title: "Personal Information",
            fields: [
              { id: "name", label: "Name", type: "text" },
              { id: "email", label: "Email", type: "text" },
              { id: "now", label: "Now", type: "datetime" },
              { id: "weekday", label: "Favorite Day", type: "select", options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
            ],
          },
          {
            id: "step2",
            title: "Survey Questions",
            fields: [
              { id: "satisfaction", label: "How satisfied are you?", type: "text" },
              { id: "improvements", label: "What can we improve?", type: "text" },
            ],
          },
        ]}
        onSubmit={handleSubmit}
        prefilledData={{ satisfaction: "Very Satisfied" }}
      />
    </div>
  );
}
