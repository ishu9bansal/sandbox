// A utility type for a fixed-size array
type FixedArray<T, N extends number, A extends T[] = []> = 
  A['length'] extends N ? A : FixedArray<T, N, [...A, T]>;

type Quadrant<T> = FixedArray<FixedArray<T, 8>, 4>; // 4 quadrants, each with 8 teeth

const COMMON_TOOTH_MAPPING = [
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
];

class TeethGrid<DataType> {
  quadrants: Quadrant<DataType>;
  private mapping: number[][];
  constructor(data: Quadrant<DataType>, mapping: number[][] = COMMON_TOOTH_MAPPING) {
    this.mapping = mapping;
    this.quadrants = data;
  }
  getData(): DataType[][] {
    return this.quadrants;
  }
  getQuadrantAndPosition(r: number, c: number): { quadrant: number; position: number } | null {
    const qp = this.mapping[r][c];
    if (qp === undefined) return null;
    const quadrant = -1 + qp/10;
    const position = -1 + qp%10;
    return { quadrant, position };
  }
  getToothData(row: number, col: number): DataType | null {
    const qp = this.getQuadrantAndPosition(row, col);
    if (qp === null) return null;
    return this.quadrants[qp.quadrant][qp.position];
  }
  updateToothData(row: number, col: number, data: DataType): void {
    const qp = this.getQuadrantAndPosition(row, col);
    if (qp === null) return;
    this.quadrants[qp.quadrant][qp.position] = data;
    return;
  }
  serialize<T>(renderer: (datum: DataType | null) => T): T[][] {
    const results: T[][] = [];
    for(let i=0; i<this.mapping.length; i++){
      const resultRow: T[] = [];
      for(let j=0; j<this.mapping[i].length; j++){
        resultRow.push(renderer(this.getToothData(i, j)));
      }
      results.push(resultRow);
    }
    return results;
  }
}