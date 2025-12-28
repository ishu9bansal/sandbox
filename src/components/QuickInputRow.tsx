import React, { useRef, forwardRef, useImperativeHandle } from "react";

// partial: "", "-", "1", "12", "-1", "-12" (max 2 digits)
const isValidPartial = (v: string): boolean => /^-?\d{0,2}$/.test(v) || v === "";
const isPartial = (v: string, shiftMode: boolean): boolean => {
  if (!/^-?\d{1,2}$/.test(v)) return true;
  const num = v.slice(v.startsWith("-") ? 1 : 0);
  return num.length < (shiftMode ? 2 : 1);
}

interface QuickInputRowProps {
  name: string;
  columns: number;
  values: string[];
  onRowChange: (values: string[]) => void;
  zoneSeparators?: number[]; // indices where a left border is drawn for grouping
  labelStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  separatorStyle?: React.CSSProperties;
  inputProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
  onNextFocus?: () => void;
  onPrevFocus?: () => void;
}

export type QuickInputRowRef = {
  focusFirst: () => void;
  focusLast: () => void;
};

const QuickInputRow = forwardRef<QuickInputRowRef, QuickInputRowProps>(function QuickInputRow({
  name,
  columns,
  values,
  onRowChange,
  zoneSeparators = [0, 3, 6, 9, 12, 15],
  labelStyle,
  cellStyle,
  separatorStyle,
  inputProps,
  onNextFocus,
  onPrevFocus,
}, ref) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(columns).fill(null));
  const shiftModeRef = useRef<boolean[]>(Array(columns).fill(false));

  const focus = (c: number): void => {
    if (c < 0) {
      onPrevFocus && onPrevFocus();
      return;
    }
    if (c >= columns) {
      onNextFocus && onNextFocus();
      return;
    }
    const el = inputRefs.current[c];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const next = (c: number): void => focus(c + 1);

  const prev = (c: number): void => focus(c - 1);

  const setShiftMode = (c: number, value: boolean): void => {
    shiftModeRef.current[c] = value;
  };

  const getShiftMode = (c: number): boolean => shiftModeRef.current[c];

  const handleChange = (c: number, raw: string): void => {
    const v = raw.trim();
    if (!isValidPartial(v)) return;

    const updated = [...values];
    updated[c] = v;
    onRowChange(updated);
    
    if (!isPartial(v, getShiftMode(c))) {
      setShiftMode(c, false);
      next(c);
    }
  };

  const handleKeyDown = (c: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    const key = e.key;
    const v = values[c];

    if (key === "Shift") {
      setShiftMode(c, true);
      return;
    }

    if (key === "Backspace" && v === "") {
      e.preventDefault();
      prev(c);
      return;
    }

    if (key === "ArrowRight") {
      e.preventDefault();
      next(c);
      return;
    }
    if (key === "ArrowLeft") {
      e.preventDefault();
      prev(c);
      return;
    }
    if (key === "ArrowUp" || key === "ArrowDown") {
      // Let parent handle vertical navigation if needed; do nothing here.
      return;
    }
  };

  useImperativeHandle(ref, () => ({
    focusFirst: () => {
      focus(0);
    },
    focusLast: () => {
      focus(columns - 1);
    }
  }));

  return (
    <>
      <div style={labelStyle}>{name}</div>
      {Array.from({ length: columns }).map((_, c) => {
        const needsSeparator = zoneSeparators.includes(c);
        return (
          <input
            key={c}
            ref={(el) => {
              if (el) inputRefs.current[c] = el;
            }}
            value={values[c] ?? ""}
            onChange={(e) => handleChange(c, e.target.value)}
            onKeyDown={(e) => handleKeyDown(c, e)}
            style={{
              ...cellStyle,
              ...(needsSeparator ? separatorStyle : {})
            }}
            inputMode="numeric"
            maxLength={3}
            {...inputProps}
          />
        );
      })}
    </>
  );
});

export default QuickInputRow;
