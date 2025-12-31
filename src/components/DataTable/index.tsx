"use client";

import { useCallback, useMemo } from "react";
import { Column, DataTableProps } from "./types";
import ActionGroup from "./ActionGroup";
import TableStructure from "./TableStructure";
import useFiltering from "./useFiltering";
import useSorting from "./useSorting";
import useSelection from "./useSelection";

export default function DataTable<T>({
  title,
  data,
  columns,
  getRowId,
  onRowClick,
  bulkActions,
  rowActions,
}: DataTableProps<T>) {
  const { predicate, filters, onFilterChange, query, setQuery } = useFiltering(columns);
  const filteredData = useMemo(() => data.filter((row) => predicate(row)), [data, predicate]);

  const { sortKey, sortDir, onSortToggle, sort } = useSorting(columns);
  const sortedData = useMemo(() => sort(filteredData), [filteredData, sort]);

  const { isSelected, allSelected, someSelected, toggleRow, toggleAll } = useSelection(data, getRowId);
  const selectedRows = useMemo(() => sortedData.filter(isSelected), [sortedData, isSelected]);

  const selectionColumn = useSelectionColumn(
    isSelected,
    toggleRow,
    allSelected,
    someSelected,
    toggleAll,
  );

  const renderRowActions = useCallback((row: T) => <ActionGroup rowActions={rowActions} row={row} />, [rowActions]);

  const extendedColumns = useMemo(() => [
    selectionColumn,
    ...columns,
    {
      key: "__actions__",
      header: "Actions",
      sortable: false,
      filterable: false,
      accessor: () => "",
      render: renderRowActions,
      comparable: () => "",
      width: 140,
    },
  ], [columns, selectionColumn, renderRowActions]);





  return (
    <TableStructure
      title={title || "Results"}
      query={query}
      setQuery={setQuery}
      bulkActions={bulkActions}
      selectedRows={selectedRows}
      columns={extendedColumns}
      data={sortedData}
      sortKey={sortKey}
      sortDir={sortDir}
      onSortToggle={onSortToggle}
      filters={filters}
      onFilterChange={onFilterChange}
      onRowClick={onRowClick}
      getRowId={getRowId}
    />
  );
}

function useSelectionColumn<T>(
  isSelected: (row: T) => boolean,
  toggleRow: (row: T) => void,
  allSelected: boolean,
  someSelected: boolean,
  toggleAll: () => void,
): Column<T> {
  const renderRowCheckbox = useCallback((row: T) => {
    return (
      <input
        type="checkbox"
        checked={isSelected(row)}
        onChange={() => toggleRow(row)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }, [isSelected, toggleRow]);

  const renderGlobalCheckbox = useCallback(() => {
    return (
      <input
        type="checkbox"
        checked={allSelected}
        ref={(el) => {
          if (el) el.indeterminate = someSelected;
        }}
        onChange={toggleAll}
      />
    );
  }, [allSelected, someSelected, toggleAll]);

  const selectionColumn = useMemo(() => (
    {
      key: "__select__",
      header: "",
      sortable: false,
      filterable: false,
      accessor: () => "",
      render: renderRowCheckbox,
      comparable: () => "",
      width: 50,
      renderHeader: renderGlobalCheckbox,
    }
  ), [renderRowCheckbox, renderGlobalCheckbox]);
  return selectionColumn;
}