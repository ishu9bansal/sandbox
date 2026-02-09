import { Quadrant } from "./theeth";

export type SelectionMeasurement = 'X' | 'O' | '-'; // 'X' = missing, 'O' = Selected, 'S' = Skipped
export type TeethSelection = Quadrant<SelectionMeasurement>;
export type MeasurementSite = 'Mesio' | 'Mid' | 'Disto';
export type MeasurementArea = 'Buccal' | 'Lingual'; // Buccal or Lingual/Palatal
export type CommonMeasurement = Record<MeasurementArea, Record<MeasurementSite, number>>;
export type ParamType = '6 site' | '4 site' | 'custom';
export type CustomSitesConfig = Record<MeasurementArea, Record<MeasurementSite, boolean>>;
export type ParamEntry = {
  id: string;
  type: ParamType;
  label: string;
  entry: Quadrant<CommonMeasurement>;
  customSitesConfig?: CustomSitesConfig;
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
