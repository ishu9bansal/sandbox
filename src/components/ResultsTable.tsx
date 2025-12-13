"use client";

import { useRef } from "react";

export interface ResultsTableProps {
  title?: string;
  rows: { label: string; values: string[] }[];
  columns: number;
  showCopyButton?: boolean;
  tableStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  headerContainerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  copyButtonStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
}

const ResultsTable = ({
  title = "Results (Tab-separated - Copy & Paste to Excel)",
  rows,
  columns,
  showCopyButton = true,
  tableStyle,
  containerStyle,
  headerContainerStyle,
  titleStyle,
  copyButtonStyle,
  cellStyle,
  headerStyle,
  rowStyle
}: ResultsTableProps) => {
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

      document.execCommand("copy");
      selection?.removeAllRanges();

      // Visual feedback
      alert("Table copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy table");
    }
  };

  return (
    <div style={containerStyle}>
      {(title || showCopyButton) && (
        <div style={headerContainerStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {showCopyButton && (
            <button onClick={copyTableToClipboard} style={copyButtonStyle}>
              📋 Copy Table
            </button>
          )}
        </div>
      )}

      <table ref={tableRef} style={tableStyle}>
        <thead>
          <tr style={headerStyle}>
            <th style={cellStyle}>Measurement</th>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} style={cellStyle}>
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} style={rowStyle}>
              <td
                style={{
                  ...cellStyle,
                  fontWeight: 600,
                  textAlign: "left"
                }}
              >
                {row.label}
              </td>
              {row.values.map((value, c) => (
                <td key={c} style={cellStyle}>
                  {value || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
