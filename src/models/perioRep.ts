import { REPORT_MAPPING } from "@/utils/perio";
import { Patient } from "./patient";
import { PerioRecord } from "./perio";
import { MKey } from "./perioInput";

type Representation<T extends string> = Partial<Record<T, string>>;

type PerioRepKeys = 'label' | 'note' | 'patientId' | 'createdAt';
type PatientRepKeys = 'name' | 'age' | 'sex' | 'email' | 'contact' | 'address';
type PPDRecordRepKeys = `ppd${MKey}`;
type LGMRecordRepKeys = `lgm${MKey}`;

type PerioRecordCSVKeys = 'id' | PerioRepKeys | PatientRepKeys | PPDRecordRepKeys | LGMRecordRepKeys;
export type PerioRecordRep = Representation<PerioRecordCSVKeys>;
export function transformPerioRecordToRep(record: PerioRecord, patient?: Patient): PerioRecordRep {
  const ppd: Representation<PPDRecordRepKeys> = {};
  Object.entries(record.ppd).forEach(([key, value]) => {
    const k = key as MKey;
    ppd[`ppd${key as MKey}`] = value.toString();
  });
  const lgm: Representation<LGMRecordRepKeys> = {};
  Object.entries(record.lgm).forEach(([key, value]) => {
    const k = key as MKey;
    lgm[`lgm${key as MKey}`] = value.toString();
  });
  const rep: PerioRecordRep = {
    id: record.id,
    label: record.label,
    note: record.note,
    patientId: record.patientId ?? '',
    createdAt: record.createdAt,
    name: patient?.name ?? '',
    age: patient?.age.toString() ?? '',
    sex: patient?.sex ?? '',
    email: patient?.email ?? '',
    contact: patient?.contact ?? '',
    address: patient?.address ?? '',
    ...ppd,
    ...lgm,
  };
  return rep;
}

function tableRowFromPerioRecordRep(rep: PerioRecordRep, orderedHeaders: PerioRecordCSVKeys[]): string[] {
  return orderedHeaders.map(header => (rep[header] ?? ""));
}

export function generatePerioRecordsTable(reps: PerioRecordRep[]): string[][] {
  if (reps.length === 0) return [];
  const dataRows = reps.map(rep => tableRowFromPerioRecordRep(rep, ORDERED_HEADERS));
  return [ORDERED_HEADERS, ...dataRows];
}

export const ORDERED_HEADERS: PerioRecordCSVKeys[] = [
  'id',
  'label',
  'note',
  'patientId',
  'name',
  'age',
  'sex',
  'email',
  'contact',
  'address',
  'createdAt',
  ...REPORT_MAPPING[0].map(k => `ppd${k}` as PPDRecordRepKeys),
  ...REPORT_MAPPING[0].map(k => `lgm${k}` as LGMRecordRepKeys),
];
