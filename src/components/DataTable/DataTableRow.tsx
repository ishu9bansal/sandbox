import { styles } from "./styles";
import { Column } from "./types";

type DataTableRowProps<T> = {
  row: T;
  columns: Column<T>[];
  onClick?: (row: T) => void;
};
export default function DataTableRow<T>({ row, columns, onClick }: DataTableRowProps<T>) {
  function onRowClick(e: React.MouseEvent) {
    onClick?.(row);
  }
  return (
    <tr style={styles.row} onClick={onRowClick}>
      {columns.map((col) => (
        <td key={col.key} style={styles.cell}>
          {col.render(row)}
        </td>
      ))}
    </tr>
  );
}
