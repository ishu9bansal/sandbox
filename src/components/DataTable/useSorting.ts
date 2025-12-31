import { useCallback, useState } from "react";
import { Column } from "./types";
import { compareNumOrString } from "@/utils/helpers";

export default function useSorting<T>(columns: Column<T>[]) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  function onSortToggle(colKey: string) {
    if (sortKey === colKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(colKey);
      setSortDir("asc");
    }
  }
  const sort = useCallback((filteredData: T[]) => {
    if (!sortKey) return filteredData;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filteredData;
    const copy = [...filteredData];
    copy.sort((a, b) => {
      const av = col.comparable(a);
      const bv = col.comparable(b);
      return compareNumOrString(av, bv, sortDir);
    });
    return copy;
  }, [sortKey, sortDir, columns]);
  return { sortKey, sortDir, onSortToggle, sort };
}
