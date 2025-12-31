"use client";

import { compareNumOrString } from "@/utils/helpers";
import React, { useCallback, useMemo, useState } from "react";

export type Column<T> = {
  key: string;
  header: string;
  sortable: boolean;
  filterable: boolean;
  accessor: (row: T) => string;
  render: (row: T) => React.ReactNode;
  comparable: (row: T) => string | number;
  width?: number | string;
};

export type ColumnBuilderOptions<T> = Partial<Column<T>> & { key: string };
export function columnBuilder<T>({ key, header, sortable, filterable, accessor, render, comparable, width }: ColumnBuilderOptions<T>): Column<T> {
  const valueAtKey = (row: T) => String((row as any)[key]);
  const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
  const defaultAccessor = accessor || valueAtKey;
  return {
    key,
    header: header || capitalized,
    sortable: !!comparable || !!sortable,
    filterable: !!filterable,
    accessor: defaultAccessor,
    render: render || defaultAccessor,
    comparable: comparable || defaultAccessor,
    width,
  };
}

export function columnsBuilder<T>(...columns: ColumnBuilderOptions<T>[]): Column<T>[] {
  return columns.map((col) => columnBuilder<T>(col));
}

export type BulkAction<T> = {
  key?: string;
  label: string;
  action: (rows: T[]) => void;
  buttonStyles?: React.CSSProperties;
}

export type RowAction<T> = {
  key?: string;
  label: string;
  action: (row: T) => void;
  buttonStyles?: React.CSSProperties;
}

export type DataTableProps<T> = {
  title?: string;
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T, index?: number) => string;
  onRowClick?: (row: T) => void;
  bulkActions?: BulkAction<T>[];
  rowActions?: RowAction<T>[];
};

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
        checked={selected[id]}
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
  ], [columns]);

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
          {sortedData.map((row, i) => {
            return <DataTableRow
              key={getRowId(row, i)}
              row={row}
              columns={extendedColumns}
              onClick={onRowClick}
            />
          })}
          <EmptyView colSpan={columns.length} visible={sortedData.length === 0} />
        </tbody>
      </table>
    </div>
  );
}

type FilterRowProps<T> = {
  columns: Column<T>[];
  onFilterChange: (key: string, value: string) => void;
  filters: Record<string, string>;
};
function FilterRow<T>({ columns, onFilterChange, filters }: FilterRowProps<T>) {
  return (
    <tr>
      {columns.map((col) => (
        <th key={col.key} style={styles.cell}>
          {col.filterable ? (
            <input
              aria-label={`Filter ${col.header}`}
              placeholder={`Filter...`}
              value={filters[col.key] || ""}
              onChange={(e) => onFilterChange(col.key, e.target.value)}
              style={styles.filterInput}
            />
          ) : null}
        </th>
      ))}
    </tr>
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

type DataTableRowProps<T> = {
  row: T;
  columns: Column<T>[];
  onClick?: (row: T) => void;
};
function DataTableRow<T>({ row, columns, onClick }: DataTableRowProps<T>) {
  function onRowClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest("button, input, a")) return; // avoid accidental triggers
    onClick?.(row);
  }
  return (
    <tr style={styles.row} onClick={onRowClick}>
      {columns.map((col) => (
        <td key={col.key} style={styles.cell}>
          {col.render(row)}
        </td>
      ))}
    </tr>
  );
}

type BulkActionButtonProps<T> = {
  label: string;
  rows: T[];
  onAction?: (rows: T[]) => void;
  styles?: React.CSSProperties;
  disabled?: boolean;
}
function BulkActionButton<T>({ label, rows, onAction, disabled, styles }: BulkActionButtonProps<T>) {
  const disabledOverride = disabled ? { 
    background: "#555",
    cursor: "not-allowed",
  } : {};
  return (
    <button
      onClick={() => onAction?.(rows)}
      disabled={disabled}
      style={{
        ...styles,
        ...disabledOverride,
      }}
    >
      {label}
    </button>
  );
}

type ActionButtonProps<T> = {
  label: string;
  row: T;
  onAction?: (row: T) => void;
  buttonStyles?: React.CSSProperties;
};

function ActionButton<T>({ label, row, onAction, buttonStyles }: ActionButtonProps<T>) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onAction?.(row);
      }}
      style={{
        ...styles.actionButton,
        ...buttonStyles,
      }}
    >
      {label}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: 24,
    border: "1px solid #3a4050",
    borderRadius: 8,
    padding: 16,
    background: "#252525",
    overflowX: "auto",
  },
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  actionsBar: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
    color: "#b0b8d4",
  },
  searchInput: {
    height: 30,
    padding: "0 8px",
    borderRadius: 6,
    border: "1px solid #3a4050",
    background: "#2a2a2a",
    color: "#e0e0e0",
    fontSize: 12,
  },
  button: {
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    background: "#0066cc",
    color: "#ffffff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 12,
  },
  row: {
    borderBottom: "1px solid #3a4050",
  },
  cell: {
    padding: "8px 12px",
    border: "1px solid #3a4050",
    textAlign: "center",
    color: "#e0e0e0",
  },
  filterInput: {
    height: 28,
    padding: "0 6px",
    width: "100%",
    borderRadius: 6,
    border: "1px solid #3a4050",
    background: "#2a2a2a",
    color: "#e0e0e0",
    fontSize: 12,
  },
  actionGroup: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
  },
  actionButton: {
    padding: "4px 8px",
    fontSize: 12,
    borderRadius: 6,
    border: "1px solid #3a4050",
    background: "#2a2a2a",
    color: "#e0e0e0",
    cursor: "pointer",
  },
};
