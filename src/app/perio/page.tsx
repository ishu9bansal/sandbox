"use client";

import React, { useRef, useState } from "react";

const TEETH = 18;
const ROWS = ["Buccal", "Lingual"];
const ZONES = [
  { label: "3", size: 3 },
  { label: "2", size: 3 },
  { label: "1", size: 3 },
  { label: "1", size: 3 },
  { label: "2", size: 3 },
  { label: "3", size: 3 }
];

// partial: "", "-", "1", "12", "-1", "-12" (max 2 digits)
const isValidPartial = (v: string): boolean => /^-?\d{0,2}$/.test(v) || v === "";

// complete: -99..99, but not "" or "-"
const isComplete = (v: string): boolean => {
  if (!/^-?\d{1,2}$/.test(v)) return false;
  const n = parseInt(v, 10);
  return n >= -99 && n <= 99;
};

export default function PerioApp() {
  const [data, setData] = useState({
    Buccal: Array(TEETH).fill(""),
    Lingual: Array(TEETH).fill("")
  });

  // refs[row][col] -> input element
  const refs = useRef(ROWS.map(() => Array(TEETH).fill(null)));

  // shiftMode[row][col] -> user pressed Shift before number, expect 2 digits
  const shiftModeRef = useRef(ROWS.map(() => Array(TEETH).fill(false)));

  const tableRef = useRef(null);

  const focus = (r: number, c: number): void => {
    if (refs.current?.[r]?.[c]) {
      refs.current[r][c].focus();
      refs.current[r][c].select();
    }
  };

  const next = (r: number, c: number): void => {
    if (c < TEETH - 1) {
      focus(r, c + 1);
    } else if (r < ROWS.length - 1) {
      focus(r + 1, 0);
    }
  };

  const prev = (r: number, c: number): void => {
    if (c > 0) {
      focus(r, c - 1);
    } else if (r > 0) {
      focus(r - 1, TEETH - 1);
    }
  };

  const setShiftMode = (r: number, c: number, value: boolean): void => {
    shiftModeRef.current[r][c] = value;
  };

  const getShiftMode = (r: number, c: number): boolean => shiftModeRef.current[r][c];

  const handleChange = (r: number, c: number, raw: string): void => {
    const v = raw.trim();

    if (!isValidPartial(v)) return;

    const rowName: "Buccal" | "Lingual" = ROWS[r] as "Buccal" | "Lingual";

    setData((d) => {
      const copy = { ...d, [rowName]: [...d[rowName]] };
      copy[rowName][c] = v;
      return copy;
    });

    const inShiftMode = getShiftMode(r, c);

    // If user signaled 2-digit entry with Shift:
    if (inShiftMode) {
      if (v.length === 1) {
        // first digit, do not move yet
        return;
      }
      // length 2 now: complete two-digit number
      setShiftMode(r, c, false);
      if (isComplete(v)) next(r, c);
      return;
    }

    // Normal behaviour: any complete value auto-advances
    if (isComplete(v)) {
      next(r, c);
    }
  };

  const handleKeyDown = (r: number, c: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    const key = e.key;
    const rowName: "Buccal" | "Lingual" = ROWS[r] as "Buccal" | "Lingual";
    const v = data[rowName][c];

    if (key === "Shift") {
      // mark this cell as expecting 2 digits
      setShiftMode(r, c, true);
      return;
    }

    if (key === "Backspace" && v === "") {
      e.preventDefault();
      prev(r, c);
      return;
    }

    if (key === "ArrowRight") {
      e.preventDefault();
      next(r, c);
      return;
    }
    if (key === "ArrowLeft") {
      e.preventDefault();
      prev(r, c);
      return;
    }
    if (key === "ArrowUp") {
      e.preventDefault();
      focus(r - 1, c);
      return;
    }
    if (key === "ArrowDown") {
      e.preventDefault();
      focus(r + 1, c);
      return;
    }
  };

  const copyTableToClipboard = async () => {
    if (!tableRef.current) return;
    
    try {
      const table = tableRef.current;
      const range = document.createRange();
      range.selectNodeContents(table);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      document.execCommand('copy');
      selection?.removeAllRanges();
      
      // Visual feedback
      alert('Table copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy table');
    }
  };

  return (
    <div style={styles.app}>
      <h2>LGM Clinical Chart — Baseline</h2>

      <div style={styles.grid}>
        {/* Row 1: Zone labels */}
        <div /> {/* top-left empty */}
        {ZONES.map((z, i) => (
          <div
            key={i}
            style={{
              ...styles.zoneLabel,
              gridColumn: `span ${z.size}`
            }}
          >
            {z.label}
          </div>
        ))}

        {/* Row 2: Tooth numbers */}
        {/* <div /> */}
        {/* {Array.from({ length: TEETH }).map((_, i) => (
          <div key={i} style={styles.head}>
            {i + 1}
          </div>
        ))} */}

        {/* Buccal / Lingual rows */}
        {ROWS.map((rowName, r) => (
          <React.Fragment key={rowName}>
            <div style={styles.label}>{rowName}</div>
            {data[rowName as "Buccal" | "Lingual"].map((value: string, c: number) => (
              <input
                key={c}
                ref={(el) => {
                  if (el) refs.current[r][c] = el;
                }}
                value={value}
                inputMode="numeric"
                maxLength={3} // allow "-99"
                onChange={(e) => handleChange(r, c, e.target.value)}
                onKeyDown={(e) => handleKeyDown(r, c, e)}
                style={{
                  ...styles.cell,
                  ...(c === 0 || c === 3 || c === 6 || c === 9 || c === 12 || c === 15
                    ? styles.zoneSeparatorLeft
                    : {})
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div style={styles.legend}>
        <strong>Legend:</strong> values from -99 to 99. Negative = recession.
        Press <code>Shift</code> before typing to enter two-digit numbers.
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeaderContainer}>
          <h3 style={styles.tableTitle}>Results (Tab-separated - Copy & Paste to Excel)</h3>
          <button 
            onClick={copyTableToClipboard}
            style={styles.copyButton}
          >
            📋 Copy Table
          </button>
        </div>
        <table ref={tableRef} style={styles.resultTable}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>Measurement</th>
              {Array.from({ length: TEETH }).map((_, i) => (
                <th key={i} style={styles.tableCell}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((rowName) => (
              <tr key={rowName} style={styles.tableRow}>
                <td style={{ ...styles.tableCell, fontWeight: 600, textAlign: "left" }}>
                  {rowName}
                </td>
                {data[rowName as "Buccal" | "Lingual"].map((value: string, c: number) => (
                  <td key={c} style={styles.tableCell}>
                    {value || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "system-ui, sans-serif",
    padding: 24,
    maxWidth: 950,
    margin: "auto",
    background: "#1e1e1e",
    color: "#e0e0e0",
    minHeight: "100vh"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "80px repeat(18, 36px)",
    gap: 6,
    alignItems: "center",
    marginTop: 12
  },
  zoneLabel: {
    textAlign: "center" as const,
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 0",
    borderBottom: "1px solid #3a4050",
    borderRadius: 4,
    background: "#441919ff",
    color: "#b0b8d4"
  },
  head: {
    fontSize: 11,
    textAlign: "center" as const,
    opacity: 0.6,
    color: "#888"
  },
  label: {
    fontWeight: 600,
    fontSize: 13,
    textAlign: "right" as const,
    paddingRight: 6,
    color: "#b0b8d4"
  },
  cell: {
    height: 32,
    textAlign: "center" as const,
    borderRadius: 6,
    border: "1px solid #3a4050",
    fontSize: 14,
    outline: "none",
    background: "#2a2a2a",
    color: "#e0e0e0"
  },
  zoneSeparatorLeft: {
    borderLeft: "2px solid #556080"
  },
  legend: {
    marginTop: 16,
    fontSize: 12,
    color: "#888"
  },
  tableContainer: {
    marginTop: 24,
    border: "1px solid #3a4050",
    borderRadius: 8,
    padding: 16,
    background: "#252525",
    overflowX: "auto" as const
  },
  tableHeaderContainer: {
    display: "flex" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
    color: "#b0b8d4"
  },
  copyButton: {
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 600,
    background: "#0066cc",
    color: "#ffffff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer" as const,
    transition: "background 0.2s"
  },
  resultTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 12
  },
  tableHeader: {
    background: "#2a2a2a"
  },
  tableRow: {
    borderBottom: "1px solid #3a4050"
  },
  tableCell: {
    padding: "8px 12px",
    border: "1px solid #3a4050",
    textAlign: "center" as const,
    color: "#e0e0e0"
  },
  json: {
    marginTop: 16,
    background: "#2d2d2d",
    padding: 12,
    borderRadius: 8,
    fontSize: 12,
    color: "#b0b8d4",
    border: "1px solid #3a4050"
  }
};
