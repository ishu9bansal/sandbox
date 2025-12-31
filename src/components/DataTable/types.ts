
export type Column<T> = {
  key: string;
  header: string;
  sortable: boolean;
  filterable: boolean;
  accessor: (row: T) => string;
  render: (row: T) => React.ReactNode;
  comparable: (row: T) => string | number;
  width?: number | string;
  renderHeader?: () => React.ReactNode;
};

export type ColumnBuilderOptions<T> = Partial<Column<T>> & { key: string };

export type BulkAction<T> = {
  key?: string;
  label: string;
  action: (rows: T[]) => void;
  buttonStyles?: React.CSSProperties;
}

export type RowAction<T> = {
  key?: string;
  label: string;
  action: (row: T) => void;
  buttonStyles?: React.CSSProperties;
}

export type DataTableProps<T> = {
  title?: string;
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T, index?: number) => string;
  onRowClick?: (row: T) => void;
  bulkActions?: BulkAction<T>[];
  rowActions?: RowAction<T>[];
};
