import { CommonMeasurement, CustomSitesConfig, PerioRecord, SelectionMeasurement, TeethSelection } from "@/models/perio";
import { Quadrant } from "@/models/theeth";
import { ModelInput } from "@/models/type";

const STUDY_LIMIT = 7;
const defaltLabel = (position: number): SelectionMeasurement => {
    if (position>=7) return 'X'; // generally missing wisdom teeth
    if (position < STUDY_LIMIT) return 'O'
    return '-';
}

const generateDefaultTeeth = (): TeethSelection => {
    const nums = Array.from({length: 8}, (_, i) => i);  // [0,1,2,3,4,5,6,7]
    const quadrant = nums.map(pos => defaltLabel(pos));
    const teeth = [
        [...quadrant],  // Quadrant 1
        [...quadrant],  // Quadrant 2
        [...quadrant],  // Quadrant 3
        [...quadrant],  // Quadrant 4
    ] as TeethSelection;
    return teeth;
};

// Helper function to generate unique record IDs
export const generateRecordId = (): string => {
  return `perio-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};


export function createDefaultMeasure<T>(emptyValue: T): Quadrant<T> {
  return Array.from({ length: 4 }, () => Array.from({ length: 8 }, () => emptyValue)) as Quadrant<T>;
}

export const DEFAULT_COMMON_MEASUREMENT: CommonMeasurement = {
  Buccal: { Mesio: NaN, Mid: NaN, Disto: NaN },
  Lingual: { Mesio: NaN, Mid: NaN, Disto: NaN },
};

export function copy(data: Quadrant<CommonMeasurement>): Quadrant<CommonMeasurement> {
  return data.map(quadrant => quadrant.map(tooth => ({
    Buccal: { ...tooth.Buccal },
    Lingual: { ...tooth.Lingual },
  }))) as Quadrant<CommonMeasurement>;
}

export function generateNewRecord(): ModelInput<PerioRecord> {
  return {
    label: '',
    note: '',
    teeth: generateDefaultTeeth(),
    paramEntries: [],
    patientId: null,
  };
}

export function newMeasure() {
  return createDefaultMeasure(DEFAULT_COMMON_MEASUREMENT);
}

export function generateParamEntryId(): string {
  return `perio-entry-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function getDefaultCustomSitesConfig(): CustomSitesConfig {
  return {
    Buccal: { Mesio: true, Mid: true, Disto: true },
    Lingual: { Mesio: true, Mid: true, Disto: true },
  };
}
