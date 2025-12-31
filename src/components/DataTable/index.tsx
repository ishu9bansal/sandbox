"use client";

import { compareNumOrString } from "@/utils/helpers";
import { useCallback, useMemo, useState } from "react";
import { Column, DataTableProps } from "./types";
import ActionGroup from "./ActionGroup";
import TableStructure from "./TableStructure";

export default function DataTable<T>({
  title,
  data,
  columns,
  getRowId,
  onRowClick,
  bulkActions,
  rowActions,
}: DataTableProps<T>) {
  const { predicate, filters, onFilterChange, query, setQuery } = useFiltering(columns);
  const filteredData = useMemo(() => data.filter((row) => predicate(row)), [data, predicate]);

  const { sortKey, sortDir, onSortToggle, sort } = useSorting(columns);
  const sortedData = useMemo(() => sort(filteredData), [filteredData, sort]);

  const { isSelected, allSelected, someSelected, toggleRow, toggleAll } = useRowSelection(data, getRowId);
  const selectedRows = useMemo(() => sortedData.filter(isSelected), [sortedData, isSelected]);

  const renderRowCheckbox = useCallback((row: T) => {
    return (
      <input
        type="checkbox"
        checked={isSelected(row)}
        onChange={() => toggleRow(row)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }, [isSelected, toggleRow]);

  const renderGlobalCheckbox = useCallback(() => {
    return (
      <input
        type="checkbox"
        checked={allSelected}
        ref={(el) => {
          if (el) el.indeterminate = someSelected;
        }}
        onChange={toggleAll}
      />
    );
  }, [allSelected, someSelected, toggleAll]);

  const renderRowActions = useCallback((row: T) => <ActionGroup rowActions={rowActions} row={row} />, [rowActions]);

  const extendedColumns = useMemo(() => [
    {
      key: "__select__",
      header: "",
      sortable: false,
      filterable: false,
      accessor: () => "",
      render: renderRowCheckbox,
      comparable: () => "",
      width: 50,
      renderHeader: renderGlobalCheckbox,
    },
    ...columns,
    {
      key: "__actions__",
      header: "Actions",
      sortable: false,
      filterable: false,
      accessor: () => "",
      render: renderRowActions,
      comparable: () => "",
      width: 140,
    },
  ], [columns, renderRowCheckbox, renderRowActions, renderGlobalCheckbox]);





  return (
    <TableStructure
      title={title || "Results"}
      query={query}
      setQuery={setQuery}
      bulkActions={bulkActions}
      selectedRows={selectedRows}
      columns={extendedColumns}
      data={sortedData}
      sortKey={sortKey}
      sortDir={sortDir}
      onSortToggle={onSortToggle}
      filters={filters}
      onFilterChange={onFilterChange}
      onRowClick={onRowClick}
      getRowId={getRowId}
    />
  );
}


function useSorting<T>(columns: Column<T>[]) {
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

function useFiltering<T>(columns: Column<T>[]) {
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

function useRowSelection<T>(data: T[], getRowId: (row: T) => string) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const allIds = useMemo(() => data.map((row) => getRowId(row)), [data, getRowId]);
  const toggleRow = useCallback((row: T) => {
    const id = getRowId(row);
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }, [setSelected]);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected[id]);
  const someSelected = allIds.some((id) => selected[id]) && !allSelected;
  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelected({});
    } else {
      const m: Record<string, boolean> = {};
      data.forEach((row) => {
        m[getRowId(row)] = true;
      });
      setSelected(m);
    }
  }, [allSelected, selected, data, getRowId, setSelected]);
  const isSelected = useCallback((row: T) => {
    const id = getRowId(row);
    return !!selected[id];
  }, [selected, getRowId]);
  return {
    isSelected,
    allSelected,
    someSelected,
    toggleRow,
    toggleAll,
  };
}
