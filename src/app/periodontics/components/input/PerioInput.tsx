import { SetStateAction, useCallback, useRef } from "react";
import QuickInputRow, { QuickInputRowRef } from "./QuickInputRow";
import { stylesGenerator } from "./style";
import { calculateColumnsFromZones, calculateZoneSeparators, deriveZones, generatePartialInputMapping } from "@/utils/perio";
import { PerioInputRecord, PerioSerializer } from "@/models/perioInput";


const labels = ['Buccal', 'Lingual', 'Lingual', 'Buccal'];

const INPUT_LIMIT = 7;
const KEY_MAPPING = generatePartialInputMapping(INPUT_LIMIT);
const serializer = new PerioSerializer(KEY_MAPPING);

const ZONES = deriveZones(KEY_MAPPING);
const COLUMNS = calculateColumnsFromZones(ZONES);
const ZONE_SEPARATORS = calculateZoneSeparators(ZONES);

interface PerioInputProps {
  data: PerioInputRecord;
  onUpdate?: (data: SetStateAction<PerioInputRecord>) => void;
  onNextFocus?: () => void;
  onPrevFocus?: () => void;
  disabled?: boolean;
}
export default function PerioInput({ data, onUpdate, onNextFocus, onPrevFocus, disabled }: PerioInputProps) {
  const values = serializer.serialize(data);
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
      <ZoneMarkers zones={ZONES} style={styles.zoneLabel} />
      {Array.from({ length: labels.length }).map((_, i) => (
        <QuickInputRow
          key={i}
          ref={(el) => {
            if (el) inputRefs.current[i] = el;
          }}
          label={labels[i]}
          values={values[i]}
          onValueChange={(j, v) => onUpdate?.(serializer.updator(i, j, v))}
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
      {zones.map((z, i) => (<div key={i} style={{ ...style, gridColumn: `span ${z.size}` }} >{z.label}</div>))}
    </>
  );
}
