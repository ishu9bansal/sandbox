
type BulkActionButtonProps<T> = {
  label: string;
  rows: T[];
  onAction?: (rows: T[]) => void;
  styles?: React.CSSProperties;
  disabled?: boolean;
}
export default function BulkActionButton<T>({ label, rows, onAction, disabled, styles }: BulkActionButtonProps<T>) {
  const disabledOverride = disabled ? { 
    background: "#555",
    cursor: "not-allowed",
  } : {};
  return (
    <button
      onClick={() => onAction?.(rows)}
      disabled={disabled}
      style={{
        ...styles,
        ...disabledOverride,
      }}
    >
      {label}
    </button>
  );
}
