

import { styles } from "./styles";
import { Column } from "./types";

type HeaderRowProps<T> = {
  columns: Column<T>[];
  sortKey: string | null;
  sortDir: "asc" | "desc";
  onSortToggle: (colKey: string) => void;
};
export default function HeaderRow<T>({ columns, sortKey, sortDir, onSortToggle }: HeaderRowProps<T>) {
  return (
    <tr>
      {columns.map((col) => (col.renderHeader ?
        (
          <th key={col.key} style={styles.cell}>
            {col.renderHeader()}
          </th>
        ) : (
          <HeaderCell
            key={col.key}
            column={col}
            sortKey={sortKey}
            sortDir={sortDir}
            onHeaderClick={() => col.sortable && onSortToggle(col.key)}
          />
        )
      ))}
    </tr>
  );
}


type HeaderCellProps<T> = {
  column: Column<T>;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  onHeaderClick: () => void;
};
function HeaderCell<T>({ column, sortKey, sortDir, onHeaderClick }: HeaderCellProps<T>) {
  return (
    column.sortable ? (
      <SortableHeaderCell
        header={column.header}
        sortDir={sortKey === column.key ? sortDir : null}
        onSortToggle={onHeaderClick}
      />
    ) : (
      <th style={styles.cell}>
        {column.header}
      </th>
    )
  );
}

function SortableHeaderCell<T>({ header, sortDir, onSortToggle }: {
  header: string;
  sortDir: "asc" | "desc" | null;
  onSortToggle: () => void;
}) {
  return (
    <th
      style={{ ...styles.cell, cursor: "pointer" }}
      onClick={onSortToggle}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
        <span>{header}</span>
        {sortDir && (
          <span aria-hidden>{sortDir === "asc" ? "▲" : "▼"}</span>
        )}
      </div>
    </th>
  );
}
