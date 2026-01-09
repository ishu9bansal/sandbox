import { PerioRecord } from "@/models/perio";
import { MappingType, Serializer } from "@/models/perioInput";
import { generateDefaultTeeth } from "@/models/theeth";
import { ModelInput } from "@/models/type";

// Helper function to generate unique record IDs
export const generateRecordId = (): string => {
  return `perio-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export function generateNewRecord(): ModelInput<PerioRecord> {
  return {
    label: '',
    note: '',
    teeth: generateDefaultTeeth(),
    ppd: {},
    lgm: {},
    patientId: null,
  };
}

export const INPUT_MAPPING: MappingType = [
  [
    '18BMe', '18BMi', '18BDi',
    '17BMe', '17BMi', '17BDi',
    '16BMe', '16BMi', '16BDi',
    '15BMe', '15BMi', '15BDi',
    '14BMe', '14BMi', '14BDi',
    '13BMe', '13BMi', '13BDi',
    '12BMe', '12BMi', '12BDi',
    '11BMe', '11BMi', '11BDi',

    '21BMe', '21BMi', '21BDi',
    '22BMe', '22BMi', '22BDi',
    '23BMe', '23BMi', '23BDi',
    '24BMe', '24BMi', '24BDi',
    '25BMe', '25BMi', '25BDi',
    '26BMe', '26BMi', '26BDi',
    '27BMe', '27BMi', '27BDi',
    '28BMe', '28BMi', '28BDi',
  ],
  [
    '48LMe', '48LMi', '48LDi',
    '47LMe', '47LMi', '47LDi',
    '46LMe', '46LMi', '46LDi',
    '45LMe', '45LMi', '45LDi',
    '44LMe', '44LMi', '44LDi',
    '43LMe', '43LMi', '43LDi',
    '42LMe', '42LMi', '42LDi',
    '41LMe', '41LMi', '41LDi',

    '31LMe', '31LMi', '31LDi',
    '32LMe', '32LMi', '32LDi',
    '33LMe', '33LMi', '33LDi',
    '34LMe', '34LMi', '34LDi',
    '35LMe', '35LMi', '35LDi',
    '36LMe', '36LMi', '36LDi',
    '37LMe', '37LMi', '37LDi',
    '38LMe', '38LMi', '38LDi',
  ],
  [
    '48BMe', '48BMi', '48BDi',
    '47BMe', '47BMi', '47BDi',
    '46BMe', '46BMi', '46BDi',
    '45BMe', '45BMi', '45BDi',
    '44BMe', '44BMi', '44BDi',
    '43BMe', '43BMi', '43BDi',
    '42BMe', '42BMi', '42BDi',
    '41BMe', '41BMi', '41BDi',

    '31BMe', '31BMi', '31BDi',
    '32BMe', '32BMi', '32BDi',
    '33BMe', '33BMi', '33BDi',
    '34BMe', '34BMi', '34BDi',
    '35BMe', '35BMi', '35BDi',
    '36BMe', '36BMi', '36BDi',
    '37BMe', '37BMi', '37BDi',
    '38BMe', '38BMi', '38BDi',
  ],
];

export const REPORT_MAPPING: MappingType = [
  INPUT_MAPPING.flat()
];

export const inputSerializer = new Serializer(INPUT_MAPPING);
export const reportSerializer = new Serializer(REPORT_MAPPING);

export function generatePartialInputMapping(limit: number): MappingType {
  const mapping: MappingType = [];
  for (let group of INPUT_MAPPING) {
    const filteredGroup = group.filter(key => {
      const pos = parseInt(key.charAt(2)); // Extract position from key format like '18BMe'
      return pos <= limit;
    });
    mapping.push(filteredGroup);
  }
  return mapping;
}


export function deriveZones(mapping = INPUT_MAPPING, siteCount = 3): { label: string; size: number }[] {
  const labels = mapping[0].filter((_, i) => (i%siteCount === 0) ).map(el => el.charAt(2));
  return labels.map(label => ({ label, size: siteCount }));
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
  // separators.pop(); // remove last separator
  return separators;
}
