"use client";

import { useState } from "react";
import { styles } from "./style";
import QuickInputRow from "@/components/QuickInputRow";
import ResultsTable from "@/components/ResultsTable";

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
  const [data, setData] = useState([
    Array(TEETH).fill(""),
    Array(TEETH).fill("")
  ]);

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
            key={r}
            name={rowName}
            columns={TEETH}
            values={data[r]}
            onRowChange={(values) =>
              setData((d) => ({ ...d, [r]: values }))
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

      <ResultsTable
        title="Results (Tab-separated - Copy & Paste to Excel)"
        rows={ROWS.map((rowName, r) => ({
          label: rowName,
          values: data[r]
        }))}
        columns={TEETH}
        showCopyButton={true}
        containerStyle={styles.tableContainer}
        headerContainerStyle={styles.tableHeaderContainer}
        titleStyle={styles.tableTitle}
        copyButtonStyle={styles.copyButton}
        tableStyle={styles.resultTable}
        headerStyle={styles.tableHeader}
        cellStyle={styles.tableCell}
        rowStyle={styles.tableRow}
      />
    </div>
  );
}
