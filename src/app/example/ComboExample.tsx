"use client";

import DataSelector, { useDataSelectorContext } from "@/components/compositions/data-selector";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";

export default function ComboboxDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <DataSelector
      data={COMBO_INPUTS}
      typeLabel="framework"
      isSelected={(datum) => datum.value === value}
      onSelect={(datum) => setValue(datum ? datum.value : null)}
      toString={(datum) => datum.label}
    >
      <EmptyView />
    </DataSelector>
  );
}

function EmptyView() {
  const {
    searchTerm: search,
    setSearchTerm: setSearch,
  } = useDataSelectorContext();
  const onCreate = useCallback(() => {
    COMBO_INPUTS.push({ value: search.toLowerCase(), label: search });
    setSearch("");
  }, [search, setSearch]);
  return (
    <>
      <div>No results for "{search}"</div>
      <Button size="sm" className="mt-2" onClick={onCreate}>
        Create "{search}" +
      </Button>
    </>
  );
}

const COMBO_INPUTS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]
