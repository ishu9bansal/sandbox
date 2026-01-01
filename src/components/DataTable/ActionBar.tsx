import BulkActionButton from "./BulkActionButton";
import { styles } from "./styles";
import { BulkAction } from "./types";

type ActionBarProps<T> = {
  searchValue: string;
  onSearchValueChange: (q: string) => void;
  bulkActions?: BulkAction<T>[];
  selectedRows: T[];
};
export default function ActionBar<T>({ searchValue, onSearchValueChange, bulkActions, selectedRows }: ActionBarProps<T>) {
  return (
    <div style={styles.actionsBar}>
      <SearchInput value={searchValue} onChange={onSearchValueChange} />
      <BulkActionGroup bulkActions={bulkActions} selectedRows={selectedRows} />
    </div>
  );
}

export function SearchInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <input
      aria-label="Search"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.searchInput}
    />
  );
}

export function BulkActionGroup<T>({ bulkActions, selectedRows }: { bulkActions?: BulkAction<T>[]; selectedRows: T[] }) {
  if (!bulkActions || bulkActions.length === 0) return null;
  return (
    <>
      {bulkActions?.map((action) => (
        <BulkActionButton
          key={action.key || action.label}
          label={action.label}
          disabled={selectedRows.length === 0}
          rows={selectedRows}
          onAction={action.action}
          styles={{
            ...styles.button,
            ...action.buttonStyles,
          }}
        />
      ))}
    </>
  );
}
