"use client";

import { compareNumOrString } from "@/utils/helpers";
import { useCallback, useMemo, useState } from "react";
import { Column, DataTableProps } from "./types";
import ActionGroup from "./ActionGroup";
import TableStructure from "./TableStructure";

export default function DataTable<T>(props: DataTableProps<T>) {
  const {
    title,
    data,
    columns,
    getRowId,
    onRowClick,
    bulkActions,
    rowActions,
  } = props;
  // TODO: clean up logic using custom hooks
  const { sortKey, sortDir, onSortToggle } = useSortState();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [globalQuery, setGlobalQuery] = useState("");

  const allIds = useMemo(() => data.map((row, i) => getRowId(row, i)), [data, getRowId]);

  const predicate = useGlobalFilteringPredicate(columns, filters, globalQuery);
  const filteredData = useMemo(() => data.filter((row) => predicate(row)), [data, predicate]);

  const sortedData = useMemo(() => {
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
  }, [filteredData, sortKey, sortDir, columns]);

  const renderRowCheckbox = useCallback((row: T) => {
    const id = getRowId(row);
    function toggleRow(id: string) {
      setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
    }
    return (
      <input
        type="checkbox"
        checked={!!selected[id]}
        onChange={() => toggleRow(id)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }, [setSelected, selected, getRowId]);

  const renderGlobalCheckbox = useCallback(() => {
    const allSelected = allIds.length > 0 && allIds.every((id) => selected[id]);
    const someSelected = allIds.some((id) => selected[id]) && !allSelected;

    function toggleAll() {
      if (allSelected) {
        setSelected({});
      } else {
        const m: Record<string, boolean> = {};
        for (let i = 0; i < sortedData.length; i++) {
          m[getRowId(sortedData[i], i)] = true;
        }
        setSelected(m);
      }
    }

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
  }, [allIds, selected, sortedData, getRowId]);

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
  ], [columns, renderRowCheckbox, renderRowActions]);

  const selectedRows = useMemo(() => {
    return sortedData.filter((row, i) => selected[getRowId(row, i)]);
  }, [sortedData, selected, getRowId]);




  return (
    <TableStructure
      title={title || "Results"}
      query={globalQuery}
      setQuery={setGlobalQuery}
      bulkActions={bulkActions}
      selectedRows={selectedRows}
      columns={extendedColumns}
      data={sortedData}
      sortKey={sortKey}
      sortDir={sortDir}
      onSortToggle={onSortToggle}
      filters={filters}
      onFilterChange={(key: string, val: string) => setFilters((prev) => ({ ...prev, [key]: val }))}
      onRowClick={onRowClick}
      getRowId={getRowId}
    />
  );
}


function useSortState() {
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
  return { sortKey, sortDir, onSortToggle };
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

function useGlobalFilteringPredicate<T>(columns: Column<T>[], filters: Record<string, string>, globalQuery: string) {
  const searchPredicate = useSearchPredicate(columns);
  const filterPredicate = useFilterPredicate<T>(filters);
  const globalPredicate = useCallback((row: T) => {
    if (!searchPredicate(row, globalQuery)) return false;
    for (const c of columns) {
      if (!filterPredicate(row, c)) return false;
    }
    return true;
  }, [globalQuery, columns, searchPredicate, filterPredicate]);
  return globalPredicate;
}