"use client";

import { useState } from "react";
import { styles } from "./style";
import ResultsTable from "@/components/ResultsTable";
import DataTable, { Column } from "@/components/DataTable";
import PerioInput from "./PerioInput";

const TEETH = 18;

type Entry = { id: string; label: string; values: string[] };

export default function PerioApp() {
  const [savedEntries, setSavedEntries] = useState<Entry[]>([]);
  const [data, setData] = useState(Array(TEETH).fill(""));
  const onNextFocus = () => {
    // Focus on submit button
    const submitButton = document.getElementById("submit-button");
    submitButton?.focus();
  }
  const onFocusReset = () => {
    // Focus on the input at index
    const firstInput = document.querySelector('input') as HTMLInputElement;
    firstInput?.focus();
  }
  const onSubmit = () => {
    // append to saved local storage
    // const savedData = localStorage.getItem("perioData");
    // const parsedData = savedData ? JSON.parse(savedData) : [];
    // parsedData.push(data);
    // localStorage.setItem("perioData", JSON.stringify(parsedData));
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setSavedEntries([{ id, label: `Entry ${savedEntries.length + 1}`, values: data }, ...savedEntries]);
    // clear current data
    setData(Array(TEETH).fill(""));
    // focus back to first input
    onFocusReset();
  }

  return (
    <div style={styles.app}>
      <h2>LGM Clinical Chart</h2>

      <PerioInput
        label=""
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
            onFocusReset();
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
      <ResultSection
        savedEntries={savedEntries}
        onEdit={(row) => {
          // Placeholder for future editing UX (inline/modal)
          console.log("Edit requested for:", row);
          alert("Edit not implemented yet. Coming soon!");
        }}
        onDelete={(row) => {
          setSavedEntries(prev => prev.filter(e => e.id !== row.id));
        }}
        onBulkDelete={(rows) => {
          const ids = new Set(rows.map(r => r.id));
          setSavedEntries(prev => prev.filter(e => !ids.has(e.id)));
        }}
        onView={(row) => {
          // Optional hook for row click
          console.log("View row:", row);
        }}
      />
    </div>
  );
}

function ResultRow({ title, values }: { title: string; values: string[] }) {
  return (
    <ResultsTable
      title={title}
      rows={[{
        label: "Values",
        values: values
      }]}
      showCopyButton={true}
      containerStyle={styles.tableContainer}
      headerContainerStyle={styles.tableHeaderContainer}
      titleStyle={styles.tableTitle}
      copyButtonStyle={styles.copyButton}
      tableStyle={styles.resultTable}
      cellStyle={styles.tableCell}
      rowStyle={styles.tableRow}
    />
  );
}

function ResultSection({
  savedEntries,
  onEdit,
  onDelete,
  onBulkDelete,
  onView
}: {
  savedEntries: Entry[];
  onEdit?: (row: Entry) => void;
  onDelete?: (row: Entry) => void;
  onBulkDelete?: (rows: Entry[]) => void;
  onView?: (row: Entry) => void;
}) {
  if (savedEntries.length === 0) {
    return null;
  }

  const columns: Column<Entry>[] = [
    {
      key: "label",
      header: "Label",
      sortable: true,
      filterable: true,
      accessor: (row) => row.label,
    },
    {
      key: "values",
      header: "Values",
      sortable: true,
      filterable: true,
      accessor: (row) => row.values.join(" "),
      render: (value) => String(value),
    },
  ];

  return (
    <DataTable<Entry>
      title="Saved Entries"
      data={savedEntries}
      columns={columns}
      getRowId={(row) => row.id}
      onEdit={onEdit}
      onDelete={onDelete}
      onBulkDelete={onBulkDelete}
      onView={onView}
    />
  );
}
