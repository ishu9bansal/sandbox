import QuickInputRow from "@/components/QuickInputRow";
import { styles } from "./style";
import { calculateTeethFromZones, calculateZoneSeparators } from "./utils";
import { ZONES } from "./constants";

interface PerioInputProps {
  label: string;
  data: string[];
  setData: (values: string[]) => void;
  onNextFocus?: () => void;
  onPrevFocus?: () => void;
}

function PerioInput({ label, data, setData, onNextFocus, onPrevFocus }: PerioInputProps) {
  const TEETH = calculateTeethFromZones(ZONES);
  const ZONE_SEPARATORS = calculateZoneSeparators(ZONES);
  return (
    <div style={styles.grid}>
      <ZoneMarkers zones={ZONES} />
      <QuickInputRow
        name={label}
        columns={TEETH}
        values={data}
        onRowChange={setData}
        zoneSeparators={ZONE_SEPARATORS}
        labelStyle={styles.label}
        cellStyle={styles.cell}
        separatorStyle={styles.zoneSeparatorLeft}
        inputProps={{ inputMode: "tel", maxLength: 3 }}
        onNextFocus={onNextFocus}
        onPrevFocus={onPrevFocus}
      />
    </div>
  );
}

function ZoneMarkers({ zones }: { zones: { label: string; size: number }[] }) {
  return (
    <>
      <div /> {/* top-left empty */}
      {zones.map((z, i) => (
        <div
          key={i}
          style={{
            ...styles.zoneLabel,
            gridColumn: `span ${z.size}`
          }}
        >
          {z.label}
        </div>
      ))}
    </>
  );
}

export default PerioInput;