import { useCallback, useMemo, useState } from "react";

export default function useSelection<T>(data: T[], getRowId: (row: T) => string) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const allIds = useMemo(() => data.map((row) => getRowId(row)), [data, getRowId]);
  const toggleRow = useCallback((row: T) => {
    const id = getRowId(row);
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }, [setSelected]);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected[id]);
  const someSelected = allIds.some((id) => selected[id]) && !allSelected;
  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelected({});
    } else {
      const m: Record<string, boolean> = {};
      data.forEach((row) => {
        m[getRowId(row)] = true;
      });
      setSelected(m);
    }
  }, [allSelected, selected, data, getRowId, setSelected]);
  const isSelected = useCallback((row: T) => {
    const id = getRowId(row);
    return !!selected[id];
  }, [selected, getRowId]);
  return {
    isSelected,
    allSelected,
    someSelected,
    toggleRow,
    toggleAll,
  };
}
