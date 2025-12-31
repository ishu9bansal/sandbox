import { styles } from "./styles";

type ActionButtonProps<T> = {
  label: string;
  row: T;
  onAction?: (row: T) => void;
  buttonStyles?: React.CSSProperties;
};

export default function ActionButton<T>({ label, row, onAction, buttonStyles }: ActionButtonProps<T>) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onAction?.(row);
      }}
      style={{
        ...styles.actionButton,
        ...buttonStyles,
      }}
    >
      {label}
    </button>
  );
}