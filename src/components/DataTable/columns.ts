import { Column, ColumnBuilderOptions } from "./types";

export function columnBuilder<T>({ key, header, sortable, filterable, accessor, render, comparable, width }: ColumnBuilderOptions<T>): Column<T> {
  const valueAtKey = (row: T) => String((row as any)[key]);
  const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
  const defaultAccessor = accessor || valueAtKey;
  return {
    key,
    header: header || capitalized,
    sortable: !!comparable || !!sortable,
    filterable: !!filterable,
    accessor: defaultAccessor,
    render: render || defaultAccessor,
    comparable: comparable || defaultAccessor,
    width,
  };
}

export function columnsBuilder<T>(...columns: ColumnBuilderOptions<T>[]): Column<T>[] {
  return columns.map((col) => columnBuilder<T>(col));
}
