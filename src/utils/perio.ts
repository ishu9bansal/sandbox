import { PerioRecord } from "@/models/perio";
import { MappingType, Serializer } from "@/models/perioInput";
import { generateDefaultTeeth } from "@/models/theeth";
import { ModelInput } from "@/models/type";
import { INPUT_MAPPING } from "./perioMappings";

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

export const REPORT_MAPPING: MappingType = [
  INPUT_MAPPING.flat()
];

export const inputSerializer = new Serializer(INPUT_MAPPING);
export const reportSerializer = new Serializer(REPORT_MAPPING);

export function generatePartialInputMapping(limit: number): MappingType {
  const mapping: MappingType = [];
  for (let group of INPUT_MAPPING) {
    const filteredGroup = group.filter(key => {
      const pos = parseInt(key.charAt(1)); // Extract position from key format like '18BMe'
      return pos <= limit;
    });
    mapping.push(filteredGroup);
  }
  return mapping;
}


export function deriveZones(mapping = INPUT_MAPPING, siteCount = 3): { label: string; size: number }[] {
  const labels = mapping[0].filter((_, i) => (i%siteCount === 0) ).map(el => el.charAt(1)); // Extract position from key format like '18BMe'
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
