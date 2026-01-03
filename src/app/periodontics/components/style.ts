
export const stylesGenerator = (columnsNum: number, cellSize: number = 18) => {

  return {
    grid: {
      display: "grid",
      gridTemplateColumns: `50px repeat(${columnsNum}, ${cellSize}px)`,
      gap: 3,
      alignItems: "center",
      overflowX: "auto" as const,
      justifyContent: "space-around" as const,
      paddingBottom: 12,
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
    label: {
      fontWeight: 600,
      fontSize: 13,
      textAlign: "right" as const,
      paddingRight: 6,
      color: "#b0b8d4"
    },
    cell: {
      height: cellSize,
      textAlign: "center" as const,
      borderRadius: 6,
      border: "1px solid #3a4050",
      fontSize: 10,
      outline: "none",
      background: "#2a2a2a",
      color: "#e0e0e0"
    },
    zoneSeparatorLeft: {
      borderLeft: "2px solid #556080"
    },
  }
};
