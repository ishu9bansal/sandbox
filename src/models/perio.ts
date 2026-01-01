import { Quadrant } from "./theeth";

export type SelectionMeasurement = 'X' | 'O' | '-'; // 'X' = missing, 'O' = Selected, 'S' = Skipped
export type TeethSelection = Quadrant<SelectionMeasurement>;
export type CommonMeasurement = {
  B: {  // Buccal
    Mesio: number;
    Mid: number;
    Disto: number;
  };
  L: {  // Lingual/Palatal
    Mesio: number;
    Mid: number;
    Disto: number;
  };
} | null;
export type PPDRecord = Quadrant<CommonMeasurement>;
export type LGMRecord = Quadrant<CommonMeasurement>;

export interface PerioRecord {
  id: string;
  label: string;
  note: string;
  teeth: TeethSelection;
  ppd: PPDRecord;
  lgm: LGMRecord;
  patientId: string | null;
  createdAt: string;
  updatedAt: string;
}

export function createDefaultMeasure<T>(emptyValue: T): Quadrant<T> {
  return Array.from({ length: 4 }, () => Array.from({ length: 8 }, () => emptyValue)) as Quadrant<T>;
}
