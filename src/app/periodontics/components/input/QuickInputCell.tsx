import { useCallback, useEffect, useRef, useState } from "react";

interface QuickInputCellProps {
  value: string;  // TODO: change to number
  onChange: (value: string) => void;
  focus: boolean;
  onNext: () => void;
  onPrev: () => void;
  disabled?: boolean;
  cellStyle?: React.CSSProperties;
}

function QuickInputCell({
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

export default QuickInputCell;

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
      case "0":
      case "-":
      case "a":
        return onInc(-1);
      case "=":
      case "+":
      case "s":
        return onInc(1);
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
