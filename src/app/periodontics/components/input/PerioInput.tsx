import { useCallback, useRef } from "react";
import { calculateColumnsFromZones, calculateZoneSeparators } from "./utils";
import QuickInputRow, { QuickInputRowRef } from "./QuickInputRow";
import { stylesGenerator } from "./style";

interface PerioInputProps {
  data: string[][];
  zones: { label: string; size: number; }[];
  onUpdate?: (data: string[][]) => void;
  onNextFocus?: () => void;
  onPrevFocus?: () => void;
  disabled?: boolean;
}
export default function PerioInput({ data, zones, onUpdate, onNextFocus, onPrevFocus, disabled }: PerioInputProps) {
  const handleChange = (row: number, vs: string[]) => {
    const updatedData = [...data];
    updatedData[row] = vs;
    onUpdate?.(updatedData);
  };
  const COLUMNS = calculateColumnsFromZones(zones);
  const ZONE_SEPARATORS = calculateZoneSeparators(zones);
  const labels = ['Buccal', 'Lingual', 'Lingual', 'Buccal'];
  const inputRefs = useRef<(QuickInputRowRef | null)[]>(Array(labels.length).fill(null));
  const focus = (c: number, fromBehind: boolean = false): void => {
    if (c < 0) {
      onPrevFocus?.();
      return;
    }
    if (c >= labels.length) {
      onNextFocus?.();
      return;
    }
    const el = inputRefs.current[c];
    if (el) {
      const focus = fromBehind ? el.focusLast : el.focusFirst;
      focus();
    }
  };
  const next = useCallback((c: number): void => focus(c + 1), [focus]);
  const prev = useCallback((c: number): void => focus(c - 1, true), [focus]);
  const styles = stylesGenerator(COLUMNS, 28);
  const cellStyleGenerator = useCallback((index: number): React.CSSProperties => {
    return {
      ...styles.cell,
      ...(ZONE_SEPARATORS.includes(index) ? styles.zoneSeparatorLeft : {}),
    }
  }, [ZONE_SEPARATORS, styles.cell, styles.zoneSeparatorLeft]);

  return (
    <div style={styles.grid}>
      <ZoneMarkers zones={zones} style={styles.zoneLabel} />
      {Array.from({ length: labels.length }).map((_, i) => (
        <QuickInputRow
          key={i}
          ref={(el) => {
            if (el) inputRefs.current[i] = el;
          }}
          label={labels[i]}
          values={data[i]}
          onRowChange={(vs) => handleChange(i, vs)}
          disabled={disabled}
          onNextFocus={() => next(i)}
          onPrevFocus={() => prev(i)}
          labelStyle={styles.label}
          cellStyleGenerator={cellStyleGenerator}
        />
      ))}
    </div>
  );
}

function ZoneMarkers({ zones, style }: { zones: { label: string; size: number }[], style: React.CSSProperties; }) {
  return (
    <>
      <div /> {/* top-left empty */}
      {zones.map((z, i) => (
        <div
          key={i}
          style={{
            ...style,
            gridColumn: `span ${z.size}`
          }}
        >
          {z.label}
        </div>
      ))}
    </>
  );
}
