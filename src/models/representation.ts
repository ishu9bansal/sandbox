import { Patient } from "./patient";
import { MeasurementArea, MeasurementSite, PerioRecord } from "./perio";

type Representation<T extends string> = Record<T, string>;

type ToothNum = 
  '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' |
  '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' |
  '31' | '32' | '33' | '34' | '35' | '36' | '37' | '38' |
  '41' | '42' | '43' | '44' | '45' | '46' | '47' | '48';
type PerioRepKeys = 'label' | 'note' | 'patientId' | 'createdAt';
type PatientRepKeys = 'name' | 'age' | 'sex' | 'email' | 'contact' | 'address';
type PPDRecordRepKeys = `ppd_${MeasurementArea}_${MeasurementSite}_${ToothNum}`;
type LGMRecordRepKeys = `lgm_${MeasurementArea}_${MeasurementSite}_${ToothNum}`;

type PerioRecordCSVKeys = 'id' | PerioRepKeys | PatientRepKeys | PPDRecordRepKeys | LGMRecordRepKeys;
export type PerioRecordRep = Representation<PerioRecordCSVKeys>;
export function transformPerioRecordToRep(record: PerioRecord, patient?: Patient): PerioRecordRep {
  // @ts-expect-error: Dynamic keys will be added below
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
  const areas = ['Buccal', 'Lingual'] as MeasurementArea[];
  const sites = ['Mesio', 'Mid', 'Disto'] as MeasurementSite[];
  for(let i=0; i<4; i++) {
    for(let j=0; j<8; j++) {
      for(const area of areas) {
        for(const site of sites) {
          const toothNum = `${1 + i}${1 + j}` as ToothNum;
          // PPD
          const ppdKey: PPDRecordRepKeys = `ppd_${area}_${site}_${toothNum}`;
          // LGM
          const lgmKey: LGMRecordRepKeys = `lgm_${area}_${site}_${toothNum}`;
          rep[ppdKey] = record.ppd[i][j][area][site].toString();
          rep[lgmKey] = record.lgm[i][j][area][site].toString();
        }
      }
    }
  }
  return rep;
}

function tableRowFromPerioRecordRep(rep: PerioRecordRep, orderedHeaders: PerioRecordCSVKeys[]): string[] {
  return orderedHeaders.map(header => rep[header]);
}

export function generatePerioRecordsTable(reps: PerioRecordRep[]): string[][] {
  if (reps.length === 0) return [];
  const orderedHeaders = Object.keys(reps[0]) as PerioRecordCSVKeys[];  // TODO: Replace with desired order if needed
  const dataRows = reps.map(rep => tableRowFromPerioRecordRep(rep, orderedHeaders));
  return [orderedHeaders, ...dataRows];
}
