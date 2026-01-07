"use client";

import { DialogBox } from "@/components/compositions/dialog-box";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";

export default function DialogDemo() {
  const [formData, setFormData] = useState({ name: "", username: "" });
  const handleSubmit = useCallback(() => {
    alert(`Submitted data:\nName: ${formData.name}\nUsername: ${formData.username}`);
    // reset form data
    setFormData({ name: "", username: "" });
    // return true to close the dialog
    return true;
  }, [formData]);
  return (
    <DialogBox
      triggerText="Example Dialog Box"
      title="User Information"
      description="Please enter your name and username."
      submitText="Save changes"
      onSubmit={handleSubmit}
    >
      <DialogContentExample data={formData} onDataChange={setFormData} />
    </DialogBox>
  );
}

function DialogContentExample({ data, onDataChange }: { data: any; onDataChange: (data: any) => void }) {
  const { name, username } = data;
  const onFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Note: make sure to use the name attribute on Input components
    onDataChange({ ...data, [e.target.name]: e.target.value });
  }, [data, onDataChange]);
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label htmlFor="name-1">Name</Label>
        <Input id="name-1" name="name" value={name} onChange={onFieldChange} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="username-1">Username</Label>
        <Input id="username-1" name="username" value={username} onChange={onFieldChange} />
      </div>
    </div>
  );
}