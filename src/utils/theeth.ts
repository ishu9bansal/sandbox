import { TeethInputRecord, TVal } from "@/models/teethInput";
import { COMMON_TEETH_MAPPING } from "./perioMappings";

const STUDY_LIMIT = 3;
const defaltLabel = (position: number): TVal => {
  if (position>7) return 'X'; // generally missing wisdom teeth
  if (position <= STUDY_LIMIT) return 'O'
  return '-';
}

export function defaultTeethRecord() {
  const record = {} as TeethInputRecord<TVal>;
  COMMON_TEETH_MAPPING.flat().forEach((key) => {
    const position = parseInt(key.charAt(1));
    record[key] = defaltLabel(position);
  });
  return record;
};

/**
 * Mapping for TeethGrid to represent FDI notation in anatomical layout
 * Each entry is an object with quadrant (q) and position (p)
 * 18 17 16 15 14 13 12 11
 * 21 22 23 24 25 26 27 28
 * 48 47 46 45 44 43 42 41
 * 31 32 33 34 35 36 37 38
 */
export function generateVisualMapping() {
  return [
    COMMON_TEETH_MAPPING[0].slice(0,8),
    COMMON_TEETH_MAPPING[0].slice(8,16),
    COMMON_TEETH_MAPPING[1].slice(0,8),
    COMMON_TEETH_MAPPING[1].slice(8,16),
  ];
}
