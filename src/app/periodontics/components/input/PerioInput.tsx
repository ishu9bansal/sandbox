import { useRef } from "react";
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
  const inputRefs = useRef<(QuickInputRowRef | null)[]>(Array(4).fill(null));
  const focus = (c: number, fromBehind: boolean = false): void => {
    const el = inputRefs.current[c];
    if (el) {
      const focus = fromBehind ? el.focusLast : el.focusFirst;
      focus();
    }
  };
  const styles = stylesGenerator(COLUMNS, 28);

  return (
    <div style={styles.grid}>
      <ZoneMarkers zones={zones} style={styles.zoneLabel} />
      <QuickInputRow
        ref={(el) => {
          if (el) inputRefs.current[0] = el;
        }}
        name={'Buccal'}
        columns={COLUMNS}
        values={data[0]}
        onRowChange={(vs) => handleChange(0, vs)}
        zoneSeparators={ZONE_SEPARATORS}
        disabled={disabled}
        onNextFocus={() => focus(1)}
        onPrevFocus={onPrevFocus}
      />
      <QuickInputRow
        ref={(el) => {
          if (el) inputRefs.current[1] = el;
        }}
        name={'Lingual'}
        columns={COLUMNS}
        values={data[1]}
        onRowChange={(vs) => handleChange(1, vs)}
        zoneSeparators={ZONE_SEPARATORS}
        disabled={disabled}
        onNextFocus={() => focus(2)}
        onPrevFocus={() => focus(0, true)}
      />
      <QuickInputRow
        ref={(el) => {
          if (el) inputRefs.current[2] = el;
        }}
        name={'Lingual'}
        columns={COLUMNS}
        values={data[2]}
        onRowChange={(vs) => handleChange(2, vs)}
        zoneSeparators={ZONE_SEPARATORS}
        disabled={disabled}
        onNextFocus={() => focus(3)}
        onPrevFocus={() => focus(1, true)}
      />
      <QuickInputRow
        ref={(el) => {
          if (el) inputRefs.current[3] = el;
        }}
        name={'Buccal'}
        columns={COLUMNS}
        values={data[3]}
        onRowChange={(vs) => handleChange(3, vs)}
        zoneSeparators={ZONE_SEPARATORS}
        disabled={disabled}
        onNextFocus={onNextFocus}
        onPrevFocus={() => focus(2, true)}
      />
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
