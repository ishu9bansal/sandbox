import React, { forwardRef, useState, useImperativeHandle, useCallback } from "react";
import QuickInputCell from "./QuickInputCell";

interface QuickInputRowProps {
  label: string;
  values: string[];
  onRowChange: (values: string[]) => void;
  readonly?: boolean;
  disabled?: boolean[];
  onNextFocus?: () => void;
  onPrevFocus?: () => void;
  cellStyleGenerator: (index: number) => React.CSSProperties;
  labelStyle: React.CSSProperties;
}

export type QuickInputRowRef = {
  focusFirst: () => void;
  focusLast: () => void;
};

function findNextEnabled(current: number, direction: number, disabled?: boolean[]): number {
  let next = current + direction;
  if (!disabled) {
    return next;
  }
  while (next >= 0 && next < disabled.length) {
    if (!disabled[next]) {
      return next;
    }
    next += direction;
  }
  return next;
}

const QuickInputRow = forwardRef<QuickInputRowRef, QuickInputRowProps>(function QuickInputRow({
  label,
  values,
  onRowChange,
  readonly,
  disabled,
  onNextFocus,
  onPrevFocus,
  cellStyleGenerator,
  labelStyle,
}, ref) {
  const columns = values.length;
  const [currentFocus, setCurrentFocus] = useState<number>(-1);
  const focus = useCallback((c: number): void => {
    setCurrentFocus(c);
    if (c < 0)  onPrevFocus?.();
    if (c >= columns) onNextFocus?.();
  }, [columns, onNextFocus, onPrevFocus]);
  const next = useCallback((c: number): void => focus(findNextEnabled(c, 1,disabled)), [focus, disabled]);
  const prev = useCallback((c: number): void => focus(findNextEnabled(c, -1,disabled)), [focus, disabled]);
  useImperativeHandle(ref, () => ({
    focusFirst: () => next(-1),
    focusLast: () => prev(columns),
  }), [columns, next, prev]);

  const handleChange = useCallback((c: number, v: string): void => {
    const updated = [...values];
    updated[c] = v;
    onRowChange(updated);
  }, [values, onRowChange]);

  return (
    <>
      <div style={labelStyle}>{label}</div>
      {Array.from({ length: columns }).map((_, c) => (
        <QuickInputCell
          key={c}
          value={values[c]}
          focus={c === currentFocus}
          onChange={(v) => handleChange(c, v)}
          onNext={() => next(c)}
          onPrev={() => prev(c)}
          disabledDisplayValue={disabled?.[c] ? "X" : ""}
          disabled={readonly || disabled?.[c]}
          cellStyle={cellStyleGenerator(c)}
        />
      ))}
    </>
  );
});

export default QuickInputRow;
