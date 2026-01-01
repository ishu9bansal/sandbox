"use client";

import { useCallback, useMemo } from "react";
import { BulkAction, Column, DataTableProps, RowAction } from "./types";
import ActionGroup from "./ActionGroup";
import TableStructure from "./TableStructure";
import useFiltering from "./useFiltering";
import useSorting from "./useSorting";
import useSelection from "./useSelection";
import FilterRow from "./FilterRow";
import HeaderRow from "./HeaderRow";
import { BulkActionGroup, SearchInput } from "./ActionBar";

export default function DataTable<T>({ title, data, columns, getRowId, onRowClick, bulkActions, rowActions }: DataTableProps<T>) {
  const { predicate, filters, onFilterChange, query, setQuery } = useFiltering(columns);
  const filteredData = useMemo(() => data.filter((row) => predicate(row)), [data, predicate]);

  const { sortKey, sortDir, onSortToggle, sort } = useSorting(columns);
  const sortedData = useMemo(() => sort(filteredData), [filteredData, sort]);

  const { isSelected, allSelected, someSelected, toggleRow, toggleAll } = useSelection(data, getRowId);
  const selectedRows = useMemo(() => sortedData.filter(isSelected), [sortedData, isSelected]);

  const selectionColumn = useSelectionColumn(isSelected, toggleRow, allSelected, someSelected, toggleAll);
  const actionsColumn = useActionsColumn(rowActions || []);

  const extendedColumns = useMemo(() => [
    selectionColumn,
    ...columns,
    actionsColumn,
  ], [columns, selectionColumn, actionsColumn]);

  const renderFilterRow = useFilterRow<T>(filters, onFilterChange);
  const renderHeaderRow = useHeaderRow<T>(sortKey, sortDir, onSortToggle);
  const renderSearchInput = useSearchInput<T>(query, setQuery);
  const renderBulkActionGroup = useBulkActionGroup<T>(bulkActions, selectedRows);

  return (
    <TableStructure
      title={title || "Results"}
      columns={extendedColumns}
      data={sortedData}
      onRowClick={onRowClick}
      getRowId={getRowId}
      renderFilterRow={renderFilterRow}
      renderHeaderRow={renderHeaderRow}
      renderSearchInput={renderSearchInput}
      renderBulkActionGroup={renderBulkActionGroup}
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

function useActionsColumn<T>(rowActions: RowAction<T>[]): Column<T> {
  const renderRowActions = useCallback((row: T) => <ActionGroup rowActions={rowActions} row={row} />, [rowActions]);
  const actionsColumn = useMemo(() => (
    {
      key: "__actions__",
      header: "Actions",
      sortable: false,
      filterable: false,
      accessor: () => "",
      render: renderRowActions,
      comparable: () => "",
      width: 140,
    }
  ), [renderRowActions]);
  return actionsColumn;
}

function useFilterRow<T>(filters: Record<string, string>, onFilterChange: (key: string, value: string) => void) {
  const renderFilterRow = useCallback((columns: Column<T>[]) => (
    <FilterRow
      columns={columns}
      onFilterChange={onFilterChange}
      filters={filters}
    />
  ), [onFilterChange, filters]);
  return renderFilterRow;
}

function useHeaderRow<T>(sortKey: string | null, sortDir: "asc" | "desc", onSortToggle: (colKey: string) => void) {
  const renderHeaderRow = useCallback((columns: Column<T>[]) => (
    <HeaderRow
      columns={columns}
      sortKey={sortKey}
      sortDir={sortDir}
      onSortToggle={onSortToggle}
    />
  ), [sortKey, sortDir, onSortToggle]);
  return renderHeaderRow;
}

function useSearchInput<T>(query: string, setQuery: (q: string) => void) {
  const renderSearchInput = useCallback((columns: Column<T>[]) => (
    <SearchInput value={query} onChange={setQuery} />
  ), [query, setQuery]);
  return renderSearchInput;
}

function useBulkActionGroup<T>(bulkActions: BulkAction<T>[] | undefined, selectedRows: T[]) {
  const renderBulkActionGroup = useCallback((columns: Column<T>[]) => (
    <BulkActionGroup bulkActions={bulkActions} selectedRows={selectedRows} />
  ), [bulkActions, selectedRows]);
  return renderBulkActionGroup;
}
