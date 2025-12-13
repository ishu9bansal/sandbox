"use client";

import React, { useRef, useState } from "react";
import { styles } from "./style";

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
const isPartial = (v: string, shiftMode: boolean): boolean => {
  if (!/^-?\d{1,2}$/.test(v)) return true;
  const num = v.slice(v.startsWith("-") ? 1 : 0);
  return num.length < (shiftMode ? 2 : 1);
}

interface QuickInputRowProps {
  name: string;
  columns: number;
  values: string[];
  onRowChange: (values: string[]) => void;
  zoneSeparators?: number[]; // indices where a left border is drawn for grouping
  labelStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  separatorStyle?: React.CSSProperties;
  inputProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
  onNextFocus?: () => void;
  onPrevFocus?: () => void;
}

function QuickInputRow({
  name,
  columns,
  values,
  onRowChange,
  zoneSeparators = [0, 3, 6, 9, 12, 15],
  labelStyle,
  cellStyle,
  separatorStyle,
  inputProps,
  onNextFocus,
  onPrevFocus,
}: QuickInputRowProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(columns).fill(null));
  const shiftModeRef = useRef<boolean[]>(Array(columns).fill(false));

  const focus = (c: number): void => {
    if (c < 0) {
      onPrevFocus && onPrevFocus();
      return;
    }
    if (c >= columns) {
      onNextFocus && onNextFocus();
      return;
    }
    const el = inputRefs.current[c];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const next = (c: number): void => focus(c + 1);

  const prev = (c: number): void => focus(c - 1);

  const setShiftMode = (c: number, value: boolean): void => {
    shiftModeRef.current[c] = value;
  };

  const getShiftMode = (c: number): boolean => shiftModeRef.current[c];

  const handleChange = (c: number, raw: string): void => {
    const v = raw.trim();
    if (!isValidPartial(v)) return;

    const updated = [...values];
    updated[c] = v;
    onRowChange(updated);
    
    if (!isPartial(v, getShiftMode(c))) {
      setShiftMode(c, false);
      next(c);
    }
  };

  const handleKeyDown = (c: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    const key = e.key;
    const v = values[c];

    if (key === "Shift") {
      setShiftMode(c, true);
      return;
    }

    if (key === "Backspace" && v === "") {
      e.preventDefault();
      prev(c);
      return;
    }

    if (key === "ArrowRight") {
      e.preventDefault();
      next(c);
      return;
    }
    if (key === "ArrowLeft") {
      e.preventDefault();
      prev(c);
      return;
    }
    if (key === "ArrowUp" || key === "ArrowDown") {
      // Let parent handle vertical navigation if needed; do nothing here.
      return;
    }
  };

  return (
    <>
      <div style={labelStyle}>{name}</div>
      {Array.from({ length: columns }).map((_, c) => {
        const needsSeparator = zoneSeparators.includes(c);
        return (
          <input
            key={c}
            ref={(el) => {
              if (el) inputRefs.current[c] = el;
            }}
            value={values[c] ?? ""}
            onChange={(e) => handleChange(c, e.target.value)}
            onKeyDown={(e) => handleKeyDown(c, e)}
            style={{
              ...cellStyle,
              ...(needsSeparator ? separatorStyle : {})
            }}
            inputMode="numeric"
            maxLength={3}
            {...inputProps}
          />
        );
      })}
    </>
  );
}

export default function PerioApp() {
  const [data, setData] = useState({
    Buccal: Array(TEETH).fill(""),
    Lingual: Array(TEETH).fill("")
  });

  const tableRef = useRef<HTMLTableElement | null>(null);

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
          <QuickInputRow
            key={rowName}
            name={rowName}
            columns={TEETH}
            values={data[rowName as "Buccal" | "Lingual"]}
            onRowChange={(values) =>
              setData((d) => ({ ...d, [rowName]: values }))
            }
            zoneSeparators={[0, 3, 6, 9, 12, 15]}
            labelStyle={styles.label}
            cellStyle={styles.cell}
            separatorStyle={styles.zoneSeparatorLeft}
            inputProps={{
              inputMode: "numeric",
              maxLength: 3
            }}
            onNextFocus={() => {
              if (r === 0) {
                // Move from Buccal to Lingual
                const firstLingualInput = document.querySelectorAll('input')[TEETH];
                (firstLingualInput as HTMLInputElement)?.focus();
              }
            }}
            onPrevFocus={() => {
              if (r === 1) {
                // Move from Lingual to Buccal
                const lastBuccalInput = document.querySelectorAll('input')[TEETH - 1];
                (lastBuccalInput as HTMLInputElement)?.focus();
              }
            }}
          />
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
