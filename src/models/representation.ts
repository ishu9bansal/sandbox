import { PatientInput } from "./patient";
import { MeasurementArea, MeasurementSite, PerioRecord } from "./perio";

type Representation<T extends string> = Record<T, string>;

type ToothNum = 
  '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' |
  '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' |
  '31' | '32' | '33' | '34' | '35' | '36' | '37' | '38' |
  '41' | '42' | '43' | '44' | '45' | '46' | '47' | '48';
type PerioRepKeys = 'label' | 'note' | 'patientId' | 'createdAt';
type PatientRepKeys = 'name' | 'age' | 'sex' | 'email' | 'contact' | 'address';

type PerioRecordCSVKeys = 'id' | PerioRepKeys | PatientRepKeys;
type PerioEntryCSVKeys = 'record' | 'param' | 'type' | 'tooth' | 'area' | 'site' | 'value';
export type PerioRecordRep = Representation<PerioRecordCSVKeys>;
export type PerioEntryRep = Representation<PerioEntryCSVKeys>;
export function transformPerioRecordToRecordRep(record: PerioRecord, patient?: PatientInput): PerioRecordRep {
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
  };
  return rep;
}
export function transformPerioRecordToEntryReps(record: PerioRecord): PerioEntryRep[] {
  const areas = ['Buccal', 'Lingual'] as MeasurementArea[];
  const sites = ['Mesio', 'Mid', 'Disto'] as MeasurementSite[];
  const entries: PerioEntryRep[] = [];
  record.paramEntries.forEach(entry => {
    for(let i=0; i<4; i++) {
      for(let j=0; j<8; j++) {
        for(const area of areas) {
          for(const site of sites) {
            const toothNum = `${1 + i}${1 + j}` as ToothNum;
            const value = entry.entry[i][j][area][site];
            if (isNaN(value) || value === null || value === undefined) continue;
            const entryRep = {
              record: record.id,
              param: entry.label,
              type: entry.type,
              tooth: toothNum,
              area: area,
              site: site,
              value: value.toString(),
            };
            entries.push(entryRep);
          }
        }
      }
    }
  });
  return entries;
}

function tableRowFromRep<T extends string>(rep: Representation<T>, orderedHeaders: T[]): string[] {
  return orderedHeaders.map(header => rep[header]);
}

export function tableRowFromReps<T extends string>(reps: Representation<T>[], orderedHeaders: T[]): string[][] {
  const dataRows = reps.map(rep => tableRowFromRep(rep, orderedHeaders));
  return [orderedHeaders, ...dataRows];
}

export const PERIO_RECORD_CSV_HEADERS: PerioRecordCSVKeys[] = [
  'id', 'label', 'note', 'patientId', 'createdAt',
  'name', 'age', 'sex', 'email', 'contact', 'address'
];

export const PERIO_ENTRY_CSV_HEADERS: PerioEntryCSVKeys[] = [
  'record', 'param', 'type', 'tooth', 'area', 'site', 'value'
];
