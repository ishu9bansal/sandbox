import ActionButton from "./ActionButton";
import { styles } from "./styles";
import { RowAction } from "./types";

type ActionGroupProps<T> = {
  rowActions?: RowAction<T>[];
  row: T;
}
export default function ActionGroup<T>({ rowActions, row }: ActionGroupProps<T>) {
  return (
    <div style={styles.actionGroup}>
      {rowActions?.map((action) => (
        <ActionButton
          key={action.key || action.label}
          label={action.label}
          row={row}
          onAction={action.action}
          buttonStyles={action.buttonStyles}
        />
      ))}
    </div>
  );
}
