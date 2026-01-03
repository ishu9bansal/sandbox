import React, { useRef, forwardRef, useEffect, useState, useImperativeHandle, useCallback } from "react";

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
    if (c < 0) {
      onPrevFocus?.();
      return;
    }
    if (c >= columns) {
      onNextFocus?.();
      return;
    }
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

interface QuickInputCellProps {
  value: string;  // TODO: change to number
  onChange: (value: string) => void;
  focus: boolean;
  onNext: () => void;
  onPrev: () => void;
  disabled?: boolean;
  cellStyle?: React.CSSProperties;
}

export function QuickInputCell({
  value,
  onChange,
  focus,
  onNext,
  onPrev,
  disabled,
  cellStyle,
}: QuickInputCellProps) {
  const { displayValue, handleKeyEvent } = useInternalState(value, onChange);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const move = handleKeyEvent(e);
    if (move > 0) {
      onNext();
    } else if (move < 0) {
      onPrev();
    }
  }, [onNext, onPrev, handleKeyEvent]);
  const inputRef = useFocusRef(focus);
  return (
    <input
      ref={inputRef}
      value={displayValue}
      onChange={() => {}}
      onKeyDown={handleKeyDown}
      style={cellStyle}
      disabled={disabled}
      inputMode="tel"
    />
  );
}
export default QuickInputRow;

function useInternalState(initialValue: string, onChange: (value: string) => void) {
  const [initPrefix, initSuffix] = parseValue(initialValue);
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

  const onBackspace = useCallback(() => {
    if (!isNaN(suffix)) {
      setSuffix(NaN);
      return 0;
    }
    if (prefix !== 0) {
      setPrefix(0);
      return 0;
    }
    return -1;
  }, [prefix, suffix, setSuffix, setPrefix]);

  const onDigit = useCallback((digit: number) => {
    setSuffix(digit);
    return 1;
  }, [setSuffix]);

  const onInc = useCallback((inc: number) => {
    setPrefix((prev) => prev + inc);
    return 0;
  }, [setPrefix]);

  const handleKeyEvent = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
        return onDigit(num);
      case "-":
      case "=":
      case "+":
      case "a":
      case "s":
        const inc = (key === "-" || key === "a") ? -1 : 1;
        return onInc(inc);
      case "Tab":
        return e.shiftKey ? -1 : 1;
      case "ArrowRight":
        return 1;
      case "ArrowLeft":
        return -1;
      case "Backspace":
        return onBackspace();
      default:
        return 0;
    }
  }, [onBackspace, onDigit, onInc]);
  return { displayValue, handleKeyEvent };
}

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

function useFocusRef(focus: boolean) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [focus]); // Dependency on focus state
  return inputRef;
}