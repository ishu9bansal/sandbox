// A utility type for a fixed-size array
type FixedArray<T, N extends number, A extends T[] = []> = 
  A['length'] extends N ? A : FixedArray<T, N, [...A, T]>;

export type Quadrant<T> = FixedArray<FixedArray<T, 8>, 4>; // 4 quadrants, each with 8 teeth

export type SelectionMeasurement = 'X' | 'O' | '-'; // 'X' = missing, 'O' = Selected, 'S' = Skipped
export type TeethSelection = Quadrant<SelectionMeasurement>;

export const COMMON_TOOTH_MAPPING = [
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
];

// TODO: improve type safety for mapping and data
export class TeethGrid<T> {
  quadrants: Quadrant<T>;
  private mapping: number[][];
  constructor(data: Quadrant<T>, mapping: number[][] = COMMON_TOOTH_MAPPING) {
    this.mapping = mapping;
    this.quadrants = data;
  }
  getData(): T[][] {
    return this.quadrants;
  }
  getQuadrantAndPosition(r: number, c: number): { quadrant: number; position: number } | null {
    const qp = this.mapping[r][c];
    if (qp === undefined) return null;
    const quadrant = -1 + qp/10;
    const position = -1 + qp%10;
    return { quadrant, position };
  }
  getToothData(row: number, col: number): T | null {
    const qp = this.getQuadrantAndPosition(row, col);
    if (qp === null) return null;
    return this.quadrants[qp.quadrant][qp.position];
  }
  updateToothData(row: number, col: number, data: T): void {
    const qp = this.getQuadrantAndPosition(row, col);
    if (qp === null) return;
    this.quadrants[qp.quadrant][qp.position] = data;
    return;
  }
  serialize<S>(renderer: (datum: T | null, q: number, p: number) => S): S[][] {
    const results: S[][] = [];
    for(let i=0; i<this.mapping.length; i++){
      const resultRow: S[] = [];
      for(let j=0; j<this.mapping[i].length; j++){
        const { quadrant: q, position: p} = this.getQuadrantAndPosition(i, j)!; // TODO: handle null
        const datum = this.quadrants[q][p] || null;
        resultRow.push(renderer(datum, q, p));
      }
      results.push(resultRow);
    }
    return results;
  }
}

const STUDY_LIMIT = 3;
const defaltLabel = (position: number): SelectionMeasurement => {
    if (position>=7) return 'X'; // generally missing wisdom teeth
    if (position < STUDY_LIMIT) return 'O'
    return '-';
}

export const generateDefaultTeeth = (): TeethSelection => {
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
