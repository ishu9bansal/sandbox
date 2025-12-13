
export const styles = {
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
