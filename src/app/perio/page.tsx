"use client";

import { useState } from "react";
import { styles } from "./style";
import ResultsTable from "@/components/ResultsTable";
import PerioInput from "./PerioInput";

const TEETH = 18;

export default function PerioApp() {
  const [savedEntries, setSavedEntries] = useState<{ label: string, values: string[]}[]>([]);
  const [data, setData] = useState(Array(TEETH).fill(""));
  const onNextFocus = () => {
    // Focus on submit button
    const submitButton = document.getElementById("submit-button");
    submitButton?.focus();
  }
  const onSubmit = () => {
    // append to saved local storage
    // const savedData = localStorage.getItem("perioData");
    // const parsedData = savedData ? JSON.parse(savedData) : [];
    // parsedData.push(data);
    // localStorage.setItem("perioData", JSON.stringify(parsedData));
    setSavedEntries([{
      label: `Entry ${savedEntries.length + 1}`,
      values: data
    }, ...savedEntries]);
    // clear current data
    setData(Array(TEETH).fill(""));
    // focus back to first input
    const firstInput = document.querySelector('input') as HTMLInputElement;
    firstInput?.focus();
  }

  return (
    <div style={styles.app}>
      <h2>LGM Clinical Chart — Baseline</h2>

      <PerioInput
        label="Buccal"
        data={data}
        setData={setData}
        onNextFocus={onNextFocus}
      />

      <div style={styles.legend}>
        <strong>Legend:</strong> values from -99 to 99. Negative = recession.
        Press <code>Shift</code> before typing to enter two-digit numbers.
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end"}}>
        <button
          onClick={() => {
            setData(Array(TEETH).fill(""));
          }}
          style={{ marginTop: 16 }}
        >
          Clear All
        </button>
        {/* Submit Button */}
        <button style={{ marginTop: 16, marginLeft: 8 }} onClick={onSubmit} id="submit-button">
          Submit
        </button>
      </div>
      <ResultRow title="Latest Entry" values={data} />
      {(
        <div>
          <h3>Saved Entries</h3>
          {savedEntries.map((entry) => (
            <ResultRow key={entry.label} title={entry.label} values={entry.values} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResultRow({ title, values }: { title: string; values: string[] }) {
  return (
    <ResultsTable
      title={title}
      rows={[{
        label: "Buccal",
        values: values
      }]}
      columns={values.length}
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
  );
}
