"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DataSelectorProps<T> = {
  data: T[];
  typeLabel: string;
  isSelected: (datum: T) => boolean;
  onSelect: (datum: T | null) => void;
  toString: (datum: T) => string;
  renderer?: (datum: T) => React.JSX.Element;
  searchValue?: (datum: T) => string;
  uniqueKey?: (datum: T) => string;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  children?: React.JSX.Element;
};
export default function DataSelector<T>({
  data,
  isSelected,
  onSelect,
  toString,
  renderer,
  searchValue,
  uniqueKey,
  selectPlaceholder,
  searchPlaceholder,
  children,
}: DataSelectorProps<T>) {
  const [open, setOpen] = React.useState(false);
  const selected = data.find(isSelected) || null;
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {selected ? toString(selected) : (selectPlaceholder || "Select...")}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder={searchPlaceholder || "Search..."}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              <DataSelectorContext value={{ searchTerm, setSearchTerm }}>
                {children || "No results found."}
              </DataSelectorContext>
            </CommandEmpty>
            <CommandGroup>
              {data.map((datum) => (
                <CommandItem
                  key={uniqueKey?.(datum) || toString(datum)}
                  value={searchValue?.(datum)}
                  onSelect={(_) => {
                    onSelect(isSelected(datum) ? null : datum)
                    setOpen(false)
                  }}
                >
                  {renderer?.(datum) || toString(datum)}
                  <Check
                    className={cn(
                      "ml-auto",
                      isSelected(datum) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const DataSelectorContext = React.createContext({ searchTerm: "", setSearchTerm: (term: string) => {} });

export function useDataSelectorContext() {
  return React.useContext(DataSelectorContext);
}