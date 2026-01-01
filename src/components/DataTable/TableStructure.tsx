import ActionBar from "./ActionBar";
import DataTableRow from "./DataTableRow";
import FilterRow from "./FilterRow";
import HeaderRow from "./HeaderRow";
import { styles } from "./styles";
import { BulkAction, Column } from "./types";

type TableStructureProps<T> = {
  title: string;
  query: string;
  setQuery: (q: string) => void;
  bulkActions?: BulkAction<T>[];
  selectedRows: T[];
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  getRowId: (row: T) => string;
  renderFilterRow: (columns: Column<T>[]) => React.ReactNode;
  renderHeaderRow: (columns: Column<T>[]) => React.ReactNode;
}
export default function TableStructure<T>({ title, query, setQuery, bulkActions, selectedRows, columns, data, onRowClick, getRowId, renderFilterRow, renderHeaderRow }: TableStructureProps<T>) {
  return (
    <div style={styles.container}>
      <div style={styles.headerBar}>
        <h3 style={styles.title}>{title}</h3>
        <ActionBar
          searchValue={query}
          onSearchValueChange={setQuery}
          bulkActions={bulkActions}
          selectedRows={selectedRows}
        />
      </div>

      <table style={styles.table}>
        <ColumnGroup columns={columns} />
        <thead>
          {renderHeaderRow(columns)}
          {renderFilterRow(columns)}
        </thead>
        <tbody>
          {data.map((row) => (
            <DataTableRow
              key={getRowId(row)}
              row={row}
              columns={columns}
              onClick={onRowClick}
            />
          ))}
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

