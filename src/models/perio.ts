import { Quadrant } from "./theeth";

export type SelectionMeasurement = 'X' | 'O' | '-'; // 'X' = missing, 'O' = Selected, 'S' = Skipped
export type TeethSelection = Quadrant<SelectionMeasurement>;
export type MeasurementSite = 'Mesio' | 'Mid' | 'Disto';
export type MeasurementArea = 'Buccal' | 'Lingual'; // Buccal or Lingual/Palatal
export type ToothMeasurement<T> = Record<MeasurementArea, Record<MeasurementSite, T>>;
export type CommonMeasurement = ToothMeasurement<number>;
export type SitesConfig = ToothMeasurement<boolean>;
export type ParamEntry = {
  id: string;
  label: string;
  entry: Quadrant<CommonMeasurement>;
  sites: SitesConfig;
};

export interface PerioRecord {
  id: string;
  label: string;
  note: string;
  teeth: TeethSelection;
  paramEntries: ParamEntry[]
  patientId: string | null;
  createdAt: string;
  updatedAt: string;
}
