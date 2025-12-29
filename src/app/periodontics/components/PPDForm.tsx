"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { PPD, Teeth } from "@/app/store/perioSlice";
import { styles } from "./style";
import { calculateTeethFromZones, calculateZoneSeparators } from "@/app/perio/utils";
import QuickInputRow from "@/components/QuickInputRow";

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
const deriveToothSiteFromPosition = (row: number, col: number): [string, number] => {
  const key = PPDMapping[row][col];
  const [tooth, site] = key.split("-");
  return [tooth, parseInt(site)];
};
const deriveValues = (data: PPD): string[][] => {
  const values: string[][] = [];
  PPDMapping.forEach((group, rowIdx) => {
    values[rowIdx] = [];
    group.forEach((_, colIdx) => {
      const [tooth, site] = deriveToothSiteFromPosition(rowIdx, colIdx);
      const toothPPD = data[tooth];
      const value = toothPPD?.[site];
      const strValue = (value !== undefined) ? value.toString() : "";
      values[rowIdx][colIdx] = strValue;
    });
  });
  return values;
}
const deriveDataFromValues = (values: string[][]): PPD => {
  const data: PPD = {};
  values.forEach((group, rowIdx) => {
    group.forEach((val, colIdx) => {
      const [tooth, site] = deriveToothSiteFromPosition(rowIdx, colIdx);
      if (!data[tooth]) {
        data[tooth] = [];
      }
      const num = parseInt(val);
      data[tooth][site] = isNaN(num) ? 0 : num;
    });
  });
  return data;
}
function deriveZones(mapping: string[]): { label: string; size: number }[] {
  const zones: { label: string; size: number }[] = [];
  let currentLabel = "";
  let currentSize = 0;
  for (const key of mapping) {
    const site = key.split("-")[0];
    if (site !== currentLabel) {
      if (currentSize > 0) {
        zones.push({ label: currentLabel[1], size: currentSize });
      }
      currentLabel = site;
      currentSize = 1;
    } else {
      currentSize += 1;
    }
  }
  if (currentSize > 0) {
    zones.push({ label: currentLabel[1], size: currentSize });
  }
  return zones;
}
export const ZONES = deriveZones(PPDMapping[0])

export default function PPDForm({ data, teeth, onSubmit, onCancel }: PPDFormProps) {
  const [values, setValues] = useState<string[][]>(deriveValues(data));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = deriveDataFromValues(values);
    onSubmit(updatedData);
  };
  return (
    <Card title={"Edit PPD Values"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <PerioInput data={values} onUpdate={setValues} />
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


function PerioInput({ data, onUpdate }: { data: string[][]; onUpdate: (data: string[][]) => void; }) {
  const handleChange = (row: number, vs: string[]) => {
    const updatedData = [...data];
    updatedData[row] = vs;
    onUpdate(updatedData);
  };
  const COLUMNS = calculateTeethFromZones(ZONES);
  const ZONE_SEPARATORS = calculateZoneSeparators(ZONES);

  return (
    <div style={styles.grid}>
      <ZoneMarkers zones={ZONES} />
      <QuickInputRow
        name={'Buccal'}
        columns={COLUMNS}
        values={data[0]}
        onRowChange={(vs) => handleChange(0, vs)}
        zoneSeparators={ZONE_SEPARATORS}
        labelStyle={styles.label}
        cellStyle={styles.cell}
        separatorStyle={styles.zoneSeparatorLeft}
        inputProps={{ inputMode: "tel", maxLength: 3 }}
      />
      <QuickInputRow
        name={'Lingual'}
        columns={COLUMNS}
        values={data[1]}
        onRowChange={(vs) => handleChange(1, vs)}
        zoneSeparators={ZONE_SEPARATORS}
        labelStyle={styles.label}
        cellStyle={styles.cell}
        separatorStyle={styles.zoneSeparatorLeft}
        inputProps={{ inputMode: "tel", maxLength: 3 }}
      />
      <QuickInputRow
        name={'Lingual'}
        columns={COLUMNS}
        values={data[2]}
        onRowChange={(vs) => handleChange(2, vs)}
        zoneSeparators={ZONE_SEPARATORS}
        labelStyle={styles.label}
        cellStyle={styles.cell}
        separatorStyle={styles.zoneSeparatorLeft}
        inputProps={{ inputMode: "tel", maxLength: 3 }}
      />
      <QuickInputRow
        name={'Buccal'}
        columns={COLUMNS}
        values={data[3]}
        onRowChange={(vs) => handleChange(3, vs)}
        zoneSeparators={ZONE_SEPARATORS}
        labelStyle={styles.label}
        cellStyle={styles.cell}
        separatorStyle={styles.zoneSeparatorLeft}
        inputProps={{ inputMode: "tel", maxLength: 3 }}
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



