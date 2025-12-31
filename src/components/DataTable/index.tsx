"use client";

import { compareNumOrString } from "@/utils/helpers";
import { useCallback, useMemo, useState } from "react";
import { styles } from "./styles";
import { Column, DataTableProps } from "./types";
import ActionButton from "./ActionButton";
import BulkActionButton from "./BulkActionButton";
import FilterRow from "./FilterRow";
import DataTableRow from "./DataTableRow";

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

  const renderRowActions = useCallback((row: T) => {
    return (
      <div style={styles.actionGroup}>
        {rowActions?.map((action) => (
          <ActionButton
            key={action.key || action.label}
            label={action.label}
            row={row}
            onAction={action.action}
            buttonStyles={action.buttonStyles}
          />
        ))}
      </div>
    );
  }, [rowActions]);

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

  const allSelected = allIds.length > 0 && allIds.every((id) => selected[id]);
  const someSelected = allIds.some((id) => selected[id]) && !allSelected;
  const selectedRows = useMemo(() => {
    return sortedData.filter((row, i) => selected[getRowId(row, i)]);
  }, [sortedData, selected, getRowId]);

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
        <div style={styles.actionsBar}>
          <input
            aria-label="Search"
            placeholder="Search..."
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            style={styles.searchInput}
          />
          {bulkActions?.map((action) => (
            <BulkActionButton
              key={action.key || action.label}
              label={action.label}
              disabled={selectedRows.length === 0}
              rows={selectedRows}
              onAction={action.action}
              styles={{
                ...styles.button,
                ...action.buttonStyles,
              }}
            />
          ))}
        </div>
      </div>

      <table style={styles.table}>
        <colgroup>
          {/* User-defined columns */}
          {extendedColumns.map((col) => (
            <col key={col.key} style={col.width ? { width: col.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th style={styles.cell}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={toggleAll}
              />
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ ...styles.cell, cursor: col.sortable ? "pointer" : "default" }}
                onClick={() => handleHeaderClick(col)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                  <span>{col.header}</span>
                  {sortKey === col.key && (
                    <span aria-hidden>{sortDir === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
            ))}
            <th style={styles.cell}>Actions</th>
          </tr>
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

