"use client";

import DataSelector from "@/components/compositions/data-selector";
import { useState } from "react";

export default function ComboboxDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <DataSelector
      data={COMBO_INPUTS}
      typeLabel="framework"
      isSelected={(datum) => datum.value === value}
      onSelect={(datum) => setValue(datum ? datum.value : null)}
      toString={(datum) => datum.label}
    />
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
