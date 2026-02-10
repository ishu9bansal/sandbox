
import { CommonMeasurement, SitesConfig, MeasurementArea, MeasurementSite, TeethSelection } from "@/models/perio";
import { Quadrant } from "@/models/theeth";
import { copy } from "@/utils/perio";

const STUDY_LIMIT = 8;
// TODO: remove CONCATENATED_MAPPING usage in derived zones calculations
function generateAnnatomicalMapping(limit: number): {q: number, p: number}[][] {
  return [
    Array.from({ length: limit }, (_, i) => ({ q: 0, p: (limit-1-i) })),
    Array.from({ length: limit }, (_, i) => ({ q: 1, p: i })),
    Array.from({ length: limit }, (_, i) => ({ q: 3, p: (limit-1-i) })),
    Array.from({ length: limit }, (_, i) => ({ q: 2, p: i })),
  ];
}
const ANNATOMICAL_MAPPING = generateAnnatomicalMapping(STUDY_LIMIT);
function generateConcateMapping(mapping: {q: number, p: number}[][]) {
  return [
    mapping[0].concat(mapping[1]),
    mapping[2].concat(mapping[3]),
  ];
}
const CONCATENATED_MAPPING = generateConcateMapping(ANNATOMICAL_MAPPING);

const siteOrder: MeasurementSite[] = ['Mesio', 'Mid', 'Disto'];
function generateQuadrant(a: MeasurementArea, q: number, limit: number) {
  return Array.from({ length: limit }, (_, p) => (siteOrder.map((s) => ({ q, p, s, a })))).flat();
}
function generateAreaMapping(area: MeasurementArea, limit: number) {
  const quadrants = [0,1,2,3].map(q => generateQuadrant(area, q, limit));
  quadrants[0].reverse();
  quadrants[3].reverse();
  return [
    [...quadrants[0], ...quadrants[1]],
    [...quadrants[3], ...quadrants[2]],
  ];
}
const BUCCAL_MAPPING = generateAreaMapping('Buccal', STUDY_LIMIT);
const LINGUAL_MAPPING = generateAreaMapping('Lingual', STUDY_LIMIT);
const MAPPING = [
  BUCCAL_MAPPING[0],
  LINGUAL_MAPPING[0],
  LINGUAL_MAPPING[1],
  BUCCAL_MAPPING[1],
];

const valueParser = (data: Quadrant<CommonMeasurement>) => ({ s, a, q, p } : { s: MeasurementSite; a: MeasurementArea; q: number; p: number; }) => {
  const datum = data[q][p][a][s];
  return datum ? datum.toString() : '';
};
export const deriveValues = (
  data: Quadrant<CommonMeasurement>,
  mapping = MAPPING,
  valueParserFn = valueParser,
): string[][] => {
  const parser = valueParserFn(data);
  return mapping.map((group) => group.map(parser));
}
export const dataUpdaterFromValues = (values: string[][], mapping = MAPPING) => {
  return (data: Quadrant<CommonMeasurement>) => {
    const updatedData = copy(data);
    for(let i=0; i<values.length; i++) {
      for(let j=0; j<values[i].length; j++) {
        const { s, a, q, p } = mapping[i][j];
        const datum = updatedData[q][p];
        updatedData[q][p] = { 
          ...datum,
          [a]: {
            ...datum[a],
            [s]: parseInt(values[i][j])
          }
        };
      }
    }
    return updatedData;
  }
}

export function deriveDisabledInfo(
  teethSelection: TeethSelection, 
  sitesConfig: SitesConfig
): boolean[][] {
  const disabledInfo: boolean[][] = [];
  for (let i = 0; i < MAPPING.length; i++) {
    const groupInfo: boolean[] = [];
    for (let j = 0; j < MAPPING[i].length; j++) {
      const { q, p, a, s } = MAPPING[i][j];
      const toothDisabled = teethSelection[q][p] !== 'O';
      const siteDisabled = !sitesConfig[a][s];
      groupInfo.push(toothDisabled || siteDisabled);
    }
    disabledInfo.push(groupInfo);
  }
  return disabledInfo;
}

export function deriveZones(mapping = CONCATENATED_MAPPING, siteCount = siteOrder.length): { label: string; size: number }[] {
  const labels = mapping[0].map(el => (el.p+1).toString());
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

