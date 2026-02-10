import { useCallback, useEffect, useRef, useState } from "react";
import { calculateColumnsFromZones, calculateZoneSeparators, dataUpdaterFromValues, deriveDisabledInfo, deriveValues, deriveZones } from "./utils";
import QuickInputRow, { QuickInputRowRef } from "./QuickInputRow";
import { stylesGenerator } from "./style";
import { Quadrant } from "@/models/theeth";
import { CommonMeasurement, CustomSitesConfig, ParamType, TeethSelection } from "@/models/perio";


const ZONES = deriveZones();
const COLUMNS = calculateColumnsFromZones(ZONES);
const ZONE_SEPARATORS = calculateZoneSeparators(ZONES);
const labels = ['Buccal', 'Lingual', 'Lingual', 'Buccal'];

interface PerioInputProps {
  data: Quadrant<CommonMeasurement>;
  teeth?: TeethSelection;
  onUpdate?: (data: Quadrant<CommonMeasurement>) => void;
  onNextFocus?: () => void;
  onPrevFocus?: () => void;
  paramType?: ParamType;
  customSitesConfig: CustomSitesConfig;  // Now required
  readonly?: boolean;
}
export default function PerioInput({
  data,
  teeth,
  onUpdate,
  onNextFocus,
  onPrevFocus,
  paramType = '6 site',
  customSitesConfig,
  readonly,
}: PerioInputProps) {
  const [values, setValues] = useState<string[][]>(deriveValues(data));
  const allTeethSelected: TeethSelection = Array.from({ length: 4 }, () => Array.from({ length: 8 }, () => 'O')) as TeethSelection;
  const disabledInfo = deriveDisabledInfo(teeth || allTeethSelected, customSitesConfig);
  const handleChange = (row: number, vs: string[]) => {
    setValues((prev) => {
      const updated = [...prev];
      updated[row] = vs;
      return updated;
    })
  };
  useEffect(() => {
    if (onUpdate) {
      const updateData = dataUpdaterFromValues(values);
      const updated = updateData(data);
      onUpdate(updated);
    }
  }, [values]);
  const { inputRefs, next, prev } = useFocus(labels.length, onNextFocus, onPrevFocus);
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
          disabled={disabledInfo[i]}
          onRowChange={(vs) => handleChange(i, vs)}
          readonly={readonly}
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

function useFocus(limit: number, onNextFocus?: () => void, onPrevFocus?: () => void) {
  const inputRefs = useRef<(QuickInputRowRef | null)[]>(Array(labels.length).fill(null));
  const next = useCallback((c: number): void => {
    c += 1;
    const focus =  (c >= limit) ? onNextFocus : inputRefs.current[c]?.focusFirst;
    if (focus) focus();
  }, [limit, onNextFocus]);
  const prev = useCallback((c: number): void => {
    c -= 1;
    const focus =  (c < 0) ? onPrevFocus : inputRefs.current[c]?.focusLast;
    if (focus) focus();
  }, [onPrevFocus]);
  useEffect(() => {
    next(-1); // focus first on mount
  }, []);
  return { inputRefs, next, prev };
}
