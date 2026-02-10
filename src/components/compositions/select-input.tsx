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

type Option = { label: string; value: string; disabled?: boolean; };
type SelectInputProps = {
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[] | string[];
}
export function SelectInput({
  placeholder = "Select...",
  label,
  value,
  onChange,
  options,
}: SelectInputProps) {
  const formattedOptions: Option[] = typeof options[0] === "string"
    ? (options as string[]).map((opt) => ({ label: opt, value: opt }))
    : (options as Option[]);
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {formattedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
