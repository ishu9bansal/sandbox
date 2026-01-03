import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { ca } from "zod/locales";

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
    // TODO: handle negative input from mobile
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

    if (key === "*" || key === "#") {
      e.preventDefault();
      const inc = key === "#" ? 10 : -10;
      const updated = [...values];
      updated[c] = parseInt(v || "0") + inc + "";
      onRowChange(updated);
      return;
    }
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
            inputMode="tel"
            maxLength={3}
            {...inputProps}
          />
        );
      })}
    </>
  );
});

interface QuickInputCellProps {
  value: string;
  focus: boolean;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  disabled?: boolean;
  cellStyle?: React.CSSProperties;
}

export function QuickInputCell({
  value,
  focus,
  onChange,
  onNext,
  onPrev,
  disabled,
  cellStyle,
}: QuickInputCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [focus]); // Dependency on focus state

  function parseValue(v: string): [number, number] {
    if (v === "") return [0, NaN];
    if (v === "-") return [-1, NaN];
    const match = v.match(/^(-?)(\d{1,2})$/);
    if (match) {
      const prefix = match[1] === "-" ? -1 : 1;
      const num = parseInt(match[2]);
      if (num >= 0 && num <= 99) {
        return [prefix * Math.floor(num / 10), num % 10];
      }
    }
    return [0, NaN];
  }
  const [initPrefix, initSuffix] = parseValue(value);
  const [prefix, setPrefix] = useState<number>(initPrefix);
  const [suffix, setSuffix] = useState<number>(initSuffix);
  const displayPrefix = 
      prefix < -1 ? `${prefix + 1}`
    : prefix === -1 ? "-"
    : prefix === 0 ? ""
    : prefix;
  const displaySuffix = isNaN(suffix) ? (prefix === 0 ? "" : "0") : suffix;
  const displayValue = `${displayPrefix}${displaySuffix}`;
  useEffect(() => {
    onChange(displayValue);
  }, [displayValue]);

  const onBackspace = (): void => {
    if (!isNaN(suffix)) {
      setSuffix(NaN);
      return;
    }
    if (prefix !== 0) {
      setPrefix(0);
      return;
    }
    onPrev();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // if key is a digit, move to next
    const key = e.key;
    if (/^[0-9]$/.test(key)) {
      onNext();
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const key = e.key;
    switch(key) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        const num = parseInt(key);
        setSuffix(num);
        break;
      case "-":
      case "=":
      case "+":
      case "a":
      case "s":
        const inc = (key === "-" || key === "a") ? -1 : 1;
        setPrefix(prev => (prev + inc));
        break;
      case "ArrowRight":
        onNext();
        break;
      case "ArrowLeft":
        onPrev();
        break;
      case "Backspace":
        onBackspace();
        break;
      default:
        return;
    }
  };
  return (
    <input
      ref={inputRef}
      value={displayValue}
      onChange={() => {}}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={cellStyle}
      disabled={disabled}
      inputMode="tel"
    />
  );
}
export default QuickInputRow;
