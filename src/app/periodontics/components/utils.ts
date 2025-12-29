
import { LGM, PPD } from "@/app/store/perioSlice";

const deriveToothSiteFromPosition = (row: number, col: number, mapping: string[][]): [string, number] => {
  const key = mapping[row][col];
  const [tooth, site] = key.split("-");
  return [tooth, parseInt(site)];
};
export const deriveValues = (data: PPD | LGM, mapping: string[][]): string[][] => {
  const values: string[][] = [];
  mapping.forEach((group, rowIdx) => {
    values[rowIdx] = [];
    group.forEach((_, colIdx) => {
      const [tooth, site] = deriveToothSiteFromPosition(rowIdx, colIdx, mapping);
      const toothPPD = data[tooth];
      const value = toothPPD?.[site];
      const strValue = (value !== undefined) ? value.toString() : "";
      values[rowIdx][colIdx] = strValue;
    });
  });
  return values;
}
export const deriveDataFromValues = (values: string[][], mapping: string[][]): PPD | LGM => {
  const data: PPD | LGM = {};
  values.forEach((group, rowIdx) => {
    group.forEach((val, colIdx) => {
      const [tooth, site] = deriveToothSiteFromPosition(rowIdx, colIdx, mapping);
      if (!data[tooth]) {
        data[tooth] = [];
      }
      const num = parseInt(val);
      data[tooth][site] = isNaN(num) ? 0 : num;
    });
  });
  return data;
}

export function deriveZones(mapping: string[]): { label: string; size: number }[] {
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

export function calculateColumnsFromZones(zones: { size: number }[]): number {
  return zones.reduce((sum, z) => sum + z.size, 0);
}

export function calculateZoneSeparators(zones: { size: number }[]): number[] {
  const separators: number[] = [];
  let cumulative = 0;
  for (const z of zones) {
    separators.push(cumulative);
    cumulative += z.size;
  }
  separators.pop(); // remove last separator
  return separators;
}

