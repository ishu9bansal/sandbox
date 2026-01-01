import { styles } from "./styles";
import { Column } from "./types";

type TableStructureProps<T> = {
  title: string;
  columns: Column<T>[];
  data: T[];
  renderFilterRow: (columns: Column<T>[]) => React.ReactNode;
  renderHeaderRow: (columns: Column<T>[]) => React.ReactNode;
  renderSearchInput: (columns: Column<T>[]) => React.ReactNode;
  renderBulkActionGroup: (columns: Column<T>[]) => React.ReactNode;
  renderDataRows: (columns: Column<T>[], data: T[]) => React.ReactNode;
}
export default function TableStructure<T>({ title, columns, data, renderFilterRow, renderHeaderRow, renderSearchInput, renderBulkActionGroup, renderDataRows }: TableStructureProps<T>) {
  return (
    <div style={styles.container}>
      <div style={styles.headerBar}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.actionsBar}>
          {renderSearchInput(columns)}
          {renderBulkActionGroup(columns)}
        </div>
      </div>

      <table style={styles.table}>
        <ColumnGroup columns={columns} />
        <thead>
          {renderHeaderRow(columns)}
          {renderFilterRow(columns)}
        </thead>
        <tbody>
          {renderDataRows(columns, data)}
          <EmptyView colSpan={columns.length} visible={data.length === 0} />
        </tbody>
      </table>
    </div>
  );
}

function ColumnGroup<T>({ columns }: { columns: Column<T>[] }) {
  return (
    <colgroup>
      {columns.map((col) => (
        <col key={col.key} style={col.width ? { width: col.width } : undefined} />
      ))}
    </colgroup>
  );
}

function EmptyView({ visible = true, colSpan }: { colSpan: number, visible?: boolean }) {
  if (!visible) return null;
  return (
    <tr>
      <td colSpan={colSpan} style={styles.cell}>
        No results
      </td>
    </tr>
  );
}

