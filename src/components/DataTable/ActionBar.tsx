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
      <input
        aria-label="Search"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => onSearchValueChange(e.target.value)}
        style={styles.searchInput}
      />
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
    </div>
  );
}
