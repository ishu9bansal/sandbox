"use client";

import React, { useMemo, useState } from "react";

export type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  accessor?: (row: T) => any;
  render?: (value: any, row: T) => React.ReactNode;
  width?: number | string;
};

export type DataTableProps<T> = {
  title?: string;
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T, index: number) => string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onBulkDelete?: (rows: T[]) => void;
  // Styles (optional) so parent can control appearance
  containerStyle?: React.CSSProperties;
  headerContainerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  actionButtonStyle?: React.CSSProperties;
};

function asComparable(v: any): { v: string | number; isNumber: boolean } {
  if (v == null) return { v: "", isNumber: false };
  if (Array.isArray(v)) return asComparable(v.join(" "));
  if (typeof v === "number") return { v, isNumber: true };
  const n = Number(v);
  if (!Number.isNaN(n) && String(v).trim() !== "") return { v: n, isNumber: true };
  return { v: String(v).toLowerCase(), isNumber: false };
}

function getCellValue<T>(row: T, col: Column<T>) {
  const raw = col.accessor ? col.accessor(row) : (row as any)[col.key];
  return raw;
}

function csvEscape(value: any): string {
  let s = value == null ? "" : Array.isArray(value) ? value.join(" ") : String(value);
  s = s.replace(/"/g, '""');
  return `"${s}"`;
}

export default function DataTable<T>(props: DataTableProps<T>) {
  const {
    title,
    data,
    columns,
    getRowId,
    onEdit,
    onDelete,
    onView,
    onBulkDelete,
    containerStyle,
    headerContainerStyle,
    titleStyle,
    tableStyle,
    rowStyle,
    cellStyle,
    actionButtonStyle,
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
          .map((c) => getCellValue(row, c))
          .map((v) => (Array.isArray(v) ? v.join(" ") : String(v)))
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      for (const c of columns) {
        const f = (filters[c.key] || "").trim().toLowerCase();
        if (!f) continue;
        const v = getCellValue(row, c);
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
      const av = asComparable(getCellValue(a, col));
      const bv = asComparable(getCellValue(b, col));
      if (av.isNumber && bv.isNumber) {
        return sortDir === "asc" ? (av.v as number) - (bv.v as number) : (bv.v as number) - (av.v as number);
      }
      const sa = String(av.v);
      const sb = String(bv.v);
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
    return copy;
  }, [filteredData, sortKey, sortDir, columns]);

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

  function toggleRow(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
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

  function copyCsv(rows: T[]) {
    const visibleCols = columns; // include all configured columns
    const header = visibleCols.map((c) => csvEscape(c.header)).join(",");
    const body = rows
      .map((row) =>
        visibleCols
          .map((c) => csvEscape(getCellValue(row, c)))
          .join(",")
      )
      .join("\n");
    const csv = header + "\n" + body;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(csv);
    }
  }

  function onRowClick(e: React.MouseEvent, row: T) {
    const target = e.target as HTMLElement;
    if (target.closest("button, input, a")) return; // avoid accidental triggers
    onView?.(row);
  }

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <h3 style={titleStyle}>{title || "Results"}</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            aria-label="Search"
            placeholder="Search..."
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            style={{
              height: 30,
              padding: "0 8px",
              borderRadius: 6,
              border: "1px solid #3a4050",
              background: "#2a2a2a",
              color: "#e0e0e0",
              fontSize: 12,
            }}
          />
          <button
            onClick={() => onBulkDelete?.(selectedRows)}
            disabled={selectedRows.length === 0}
            style={{
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 600,
              background: selectedRows.length ? "#cc3300" : "#555",
              color: "#ffffff",
              border: "none",
              borderRadius: 6,
              cursor: selectedRows.length ? "pointer" : "not-allowed",
            }}
          >
            Delete Selected
          </button>
          <button
            onClick={() => copyCsv(selectedRows.length ? selectedRows : sortedData)}
            style={{
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 600,
              background: "#0066cc",
              color: "#ffffff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Copy {selectedRows.length ? "Selected" : "All"} CSV
          </button>
        </div>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>
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
                style={{ ...cellStyle, cursor: col.sortable ? "pointer" : "default" }}
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
            <th style={cellStyle}>Actions</th>
          </tr>
          {/* Filter row */}
          <tr>
            <th style={cellStyle}></th>
            {columns.map((col) => (
              <th key={col.key} style={cellStyle}>
                {col.filterable ? (
                  <input
                    aria-label={`Filter ${col.header}`}
                    placeholder={`Filter...`}
                    value={filters[col.key] || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
                    }
                    style={{
                      height: 28,
                      padding: "0 6px",
                      width: "100%",
                      borderRadius: 6,
                      border: "1px solid #3a4050",
                      background: "#2a2a2a",
                      color: "#e0e0e0",
                      fontSize: 12,
                    }}
                  />
                ) : null}
              </th>
            ))}
            <th style={cellStyle}></th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => {
            const id = getRowId(row, i);
            return (
              <tr key={id} style={rowStyle} onClick={(e) => onRowClick(e, row)}>
                <td style={cellStyle}>
                  <input
                    type="checkbox"
                    checked={!!selected[id]}
                    onChange={() => toggleRow(id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                {columns.map((col) => {
                  const value = getCellValue(row, col);
                  return (
                    <td key={col.key} style={cellStyle}>
                      {col.render ? col.render(value, row) : String(Array.isArray(value) ? value.join(" ") : value)}
                    </td>
                  );
                })}
                <td style={cellStyle}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(row);
                      }}
                      style={{
                        padding: "4px 8px",
                        fontSize: 12,
                        borderRadius: 6,
                        border: "1px solid #3a4050",
                        background: "#2a2a2a",
                        color: "#e0e0e0",
                        cursor: "pointer",
                        ...(actionButtonStyle || {}),
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(row);
                      }}
                      style={{
                        padding: "4px 8px",
                        fontSize: 12,
                        borderRadius: 6,
                        border: "1px solid #3a4050",
                        background: "#552222",
                        color: "#ffffff",
                        cursor: "pointer",
                        ...(actionButtonStyle || {}),
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length + 2} style={cellStyle}>
                No results
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
