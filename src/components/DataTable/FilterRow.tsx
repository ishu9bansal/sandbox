import { styles } from "./styles";
import { Column } from "./types";

type FilterRowProps<T> = {
  columns: Column<T>[];
  onFilterChange: (key: string, value: string) => void;
  filters: Record<string, string>;
};
export default function FilterRow<T>({ columns, onFilterChange, filters }: FilterRowProps<T>) {
  return (
    <tr>
      {columns.map((col) => (
        <th key={col.key} style={styles.cell}>
          {col.filterable ? (
            <input
              aria-label={`Filter ${col.header}`}
              placeholder={`Filter...`}
              value={filters[col.key] || ""}
              onChange={(e) => onFilterChange(col.key, e.target.value)}
              style={styles.filterInput}
            />
          ) : null}
        </th>
      ))}
    </tr>
  );
}
