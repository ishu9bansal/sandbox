"use client";

import { useRef, useState } from "react";
import { styles } from "./style";
import QuickInputRow from "@/components/QuickInputRow";

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
