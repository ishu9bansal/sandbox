"use client";

import { useRef, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { PPD, Teeth } from "@/app/store/perioSlice";
import { styles } from "./style";
import { calculateTeethFromZones, calculateZoneSeparators } from "@/app/perio/utils";
import QuickInputRow, { QuickInputRowRef } from "@/components/QuickInputRow";
import { deriveDataFromValues, deriveValues, deriveZones } from "./utils";

interface PPDFormProps {
  teeth: Teeth;
  data: PPD;
  onSubmit: (data: PPD) => void;
  onCancel: () => void;
}

// const PPDMapping = [
//   ['28-0','28-1','28-2','27-0','27-1','27-2','26-0','26-1','26-2','25-0','25-1','25-2','24-0','24-1','24-2','23-0','23-1','23-2','22-0','22-1','22-2','21-0','21-1','21-2','11-0','11-1','11-2','12-0','12-1','12-2','13-0','13-1','13-2','14-0','14-1','14-2','15-0','15-1','15-2','16-0','16-1','16-2','17-0','17-1','17-2','18-0','18-1','18-2'],
//   ['28-3','28-4','28-5','27-3','27-4','27-5','26-3','26-4','26-5','25-3','25-4','25-5','24-3','24-4','24-5','23-3','23-4','23-5','22-3','22-4','22-5','21-3','21-4','21-5','11-3','11-4','11-5','12-3','12-4','12-5','13-3','13-4','13-5','14-3','14-4','14-5','15-3','15-4','15-5','16-3','16-4','16-5','17-3','17-4','17-5','18-3','18-4','18-5'],
//   ['38-3','38-4','38-5','37-3','37-4','37-5','36-3','36-4','36-5','35-3','35-4','35-5','34-3','34-4','34-5','33-3','33-4','33-5','32-3','32-4','32-5','31-3','31-4','31-5','41-3','41-4','41-5','42-3','42-4','42-5','43-3','43-4','43-5','44-3','44-4','44-5','45-3','45-4','45-5','46-3','46-4','46-5','47-3','47-4','47-5','48-3','48-4','48-5'],
//   ['38-0','38-1','38-2','37-0','37-1','37-2','36-0','36-1','36-2','35-0','35-1','35-2','34-0','34-1','34-2','33-0','33-1','33-2','32-0','32-1','32-2','31-0','31-1','31-2','41-0','41-1','41-2','42-0','42-1','42-2','43-0','43-1','43-2','44-0','44-1','44-2','45-0','45-1','45-2','46-0','46-1','46-2','47-0','47-1','47-2','48-0','48-1','48-2'],
// ];

const PPDMapping = [
  ['23-0','23-1','23-2','22-0','22-1','22-2','21-0','21-1','21-2','11-0','11-1','11-2','12-0','12-1','12-2','13-0','13-1','13-2'],
  ['23-3','23-4','23-5','22-3','22-4','22-5','21-3','21-4','21-5','11-3','11-4','11-5','12-3','12-4','12-5','13-3','13-4','13-5'],
  ['33-3','33-4','33-5','32-3','32-4','32-5','31-3','31-4','31-5','41-3','41-4','41-5','42-3','42-4','42-5','43-3','43-4','43-5'],
  ['33-0','33-1','33-2','32-0','32-1','32-2','31-0','31-1','31-2','41-0','41-1','41-2','42-0','42-1','42-2','43-0','43-1','43-2'],
];

export default function PPDForm({ data, teeth, onSubmit, onCancel }: PPDFormProps) {
  const [values, setValues] = useState<string[][]>(deriveValues(data, PPDMapping));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = deriveDataFromValues(values, PPDMapping);
    onSubmit(updatedData);
  };
  const submitRef = useRef<HTMLFormElement>(null);
  const handleFocusSubmit = () => {
    const el = submitRef.current;
    if (el) {
      el.focus();
    }
  }
  return (
    <Card title={"Edit PPD Values"}>
      <form ref={submitRef} onSubmit={handleSubmit} className="space-y-4 overflow-x-auto">
        <div className="inline-block min-w-max">
          <PerioInput data={values} onUpdate={setValues} onNextFocus={handleFocusSubmit} />
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Back
          </Button>
          <Button variant="primary" type="submit">
            Next
          </Button>
        </div>
      </form>
    </Card>
  );
}


const ZONES = deriveZones(PPDMapping[0]);

interface PerioInputProps {
  data: string[][];
  onUpdate: (data: string[][]) => void;
  onNextFocus?: () => void;
  onPrevFocus?: () => void;
}
function PerioInput({ data, onUpdate, onNextFocus, onPrevFocus }: PerioInputProps) {
  const handleChange = (row: number, vs: string[]) => {
    const updatedData = [...data];
    updatedData[row] = vs;
    onUpdate(updatedData);
  };
  const COLUMNS = calculateTeethFromZones(ZONES);
  const ZONE_SEPARATORS = calculateZoneSeparators(ZONES);
  const inputRefs = useRef<(QuickInputRowRef | null)[]>(Array(4).fill(null));
  const focus = (c: number, fromBehind: boolean = false): void => {
    const el = inputRefs.current[c];
    if (el) {
      const focus = fromBehind ? el.focusLast : el.focusFirst;
      focus();
    }
  };


  return (
    <div style={styles.grid}>
      <ZoneMarkers zones={ZONES} />
      <QuickInputRow
        ref={(el) => {
          if (el) inputRefs.current[0] = el;
        }}
        name={'Buccal'}
        columns={COLUMNS}
        values={data[0]}
        onRowChange={(vs) => handleChange(0, vs)}
        zoneSeparators={ZONE_SEPARATORS}
        labelStyle={styles.label}
        cellStyle={styles.cell}
        separatorStyle={styles.zoneSeparatorLeft}
        inputProps={{ inputMode: "tel", maxLength: 3 }}
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
        labelStyle={styles.label}
        cellStyle={styles.cell}
        separatorStyle={styles.zoneSeparatorLeft}
        inputProps={{ inputMode: "tel", maxLength: 3 }}
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
        labelStyle={styles.label}
        cellStyle={styles.cell}
        separatorStyle={styles.zoneSeparatorLeft}
        inputProps={{ inputMode: "tel", maxLength: 3 }}
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
        labelStyle={styles.label}
        cellStyle={styles.cell}
        separatorStyle={styles.zoneSeparatorLeft}
        inputProps={{ inputMode: "tel", maxLength: 3 }}
        onNextFocus={onNextFocus}
        onPrevFocus={() => focus(2, true)}
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



