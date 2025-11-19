"use client";

import { Survey } from "@/components/Survey";

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
