import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type SelectInputProps = {
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[] | string[];
}
export function SelectInput({
  placeholder = "Select...",
  label,
  value,
  onChange,
  options,
}: SelectInputProps) {
  const formattedOptions = typeof options[0] === "string"
    ? (options as string[]).map((opt) => ({ label: opt, value: opt }))
    : (options as { label: string; value: string }[]);
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {formattedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
