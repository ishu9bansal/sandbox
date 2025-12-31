import { useCallback, useState } from "react";
import { Column } from "./types";

function useSearchPredicate<T>(columns: Column<T>[]) {
  const hayCalculator = useCallback((row: T) => {
    return columns
      .map((c) => c.accessor(row))
      .join(" ")
      .toLowerCase();
  }, [columns]);

  const searchPredicate = useCallback((row: T, query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return hayCalculator(row).includes(q);
  }, [hayCalculator]);

  return searchPredicate;
}

function useFilterPredicate<T>(filters: Record<string, string>) {
  const filterPredicate = useCallback((row: T, col: Column<T>) => {
    const f = (filters[col.key] || "").trim().toLowerCase();
    if (!f) return true;
    const v = col.accessor(row).toLowerCase();
    return v.includes(f);
  }, [filters]);
  return filterPredicate;
}

export default function useFiltering<T>(columns: Column<T>[]) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const searchPredicate = useSearchPredicate(columns);
  const filterPredicate = useFilterPredicate<T>(filters);
  const predicate = useCallback((row: T) => {
    if (!searchPredicate(row, query)) return false;
    for (const c of columns) {
      if (!filterPredicate(row, c)) return false;
    }
    return true;
  }, [query, columns, searchPredicate, filterPredicate]);
  const onFilterChange = useCallback((key: string, val: string) => setFilters((prev) => ({ ...prev, [key]: val })), [setFilters]);
  return {
    predicate,
    filters,
    onFilterChange,
    query,
    setQuery,
  };
}
