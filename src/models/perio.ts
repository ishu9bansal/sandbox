import { PerioInputRecord } from "./perioInput";
import { TeethInputRecord, TVal } from "./teethInput";

export type PPDRecord = PerioInputRecord;
export type LGMRecord = PerioInputRecord;

export interface PerioRecord {
  id: string;
  label: string;
  note: string;
  teeth: TeethInputRecord<TVal>;
  ppd: PPDRecord;
  lgm: LGMRecord;
  patientId: string | null;
  createdAt: string;
  updatedAt: string;
}
