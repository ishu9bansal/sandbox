import { PerioInputRecord } from "./perioInput";
import { TeethSelection } from "./theeth";

export type PPDRecord = PerioInputRecord;
export type LGMRecord = PerioInputRecord;

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
