"use client";

import { compareNumOrString } from "@/utils/helpers";
import { useCallback, useMemo, useState } from "react";
import { styles } from "./styles";
import { Column, DataTableProps } from "./types";
import FilterRow from "./FilterRow";
import DataTableRow from "./DataTableRow";
import ActionBar from "./ActionBar";
import ActionGroup from "./ActionGroup";
import HeaderRow from "./HeaderRow";

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

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [globalQuery, setGlobalQuery] = useState("");

  const allIds = useMemo(() => data.map((row, i) => getRowId(row, i)), [data, getRowId]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const q = globalQuery.trim().toLowerCase();
      if (q) {
        const hay = columns
          .map((c) => c.accessor(row))
          .map((v) => (Array.isArray(v) ? v.join(" ") : String(v)))
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      for (const c of columns) {
        const f = (filters[c.key] || "").trim().toLowerCase();
        if (!f) continue;
        const v = c.accessor(row);
        const s = (Array.isArray(v) ? v.join(" ") : String(v)).toLowerCase();
        if (!s.includes(f)) return false;
      }
      return true;
    });
  }, [data, columns, filters, globalQuery]);

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


  function handleHeaderClick(col: Column<T>) {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col.key);
      setSortDir("asc");
    }
  }


  return (
    <div style={styles.container}>
      <div style={styles.headerBar}>
        <h3 style={styles.title}>{title || "Results"}</h3>
        <ActionBar
          searchValue={globalQuery}
          onSearchValueChange={setGlobalQuery}
          bulkActions={bulkActions}
          selectedRows={selectedRows}
        />
      </div>

      <table style={styles.table}>
        <ColumnGroup columns={extendedColumns} />
        <thead>
          <HeaderRow
            columns={extendedColumns}
            sortKey={sortKey}
            sortDir={sortDir}
            onHeaderClick={handleHeaderClick}
          />
          {/* Filter row */}
          <FilterRow
            columns={extendedColumns}
            onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
            filters={filters}
          />
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <DataTableRow
              key={getRowId(row)}
              row={row}
              columns={extendedColumns}
              onClick={onRowClick}
            />
          ))}
          <EmptyView colSpan={columns.length} visible={sortedData.length === 0} />
        </tbody>
      </table>
    </div>
  );
}

function ColumnGroup<T>({ columns }: { columns: Column<T>[] }) {
  return (
    <colgroup>
      {columns.map((col) => (
        <col key={col.key} style={col.width ? { width: col.width } : undefined} />
      ))}
    </colgroup>
  );
}

function EmptyView({ visible = true, colSpan }: { colSpan: number, visible?: boolean }) {
  if (!visible) return null;
  return (
    <tr>
      <td colSpan={colSpan} style={styles.cell}>
        No results
      </td>
    </tr>
  );
}

