import React, { forwardRef, useState, useImperativeHandle, useCallback } from "react";
import QuickInputCell from "./QuickInputCell";

interface QuickInputRowProps {
  label: string;
  values: string[];
  onRowChange: (values: string[]) => void;
  disabled?: boolean;
  onNextFocus?: () => void;
  onPrevFocus?: () => void;
  cellStyleGenerator: (index: number) => React.CSSProperties;
  labelStyle: React.CSSProperties;
}

export type QuickInputRowRef = {
  focusFirst: () => void;
  focusLast: () => void;
};

const QuickInputRow = forwardRef<QuickInputRowRef, QuickInputRowProps>(function QuickInputRow({
  label,
  values,
  onRowChange,
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
  const next = useCallback((c: number): void => focus(c + 1), [focus]);
  const prev = useCallback((c: number): void => focus(c - 1), [focus]);
  useImperativeHandle(ref, () => ({
    focusFirst: () => focus(0),
    focusLast: () => focus(columns - 1),
  }), [columns, focus]);

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
          disabled={disabled}
          cellStyle={cellStyleGenerator(c)}
        />
      ))}
    </>
  );
});

export default QuickInputRow;
