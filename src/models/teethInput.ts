
export type Posi = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Quad = 1 | 2 | 3 | 4;
export type TKey = `${Quad}${Posi}`;

export type PerioInputRecord = Partial<Record<TKey, number>>;

export type PerioMappingType = TKey[][];

export class PerioSerializer {
  constructor(public mapping: PerioMappingType) {}
  serialize(data: PerioInputRecord): number[][] {
    return this.mapping.map(group => group.map(key => (data[key] || NaN)));
  }
  deserialize(values: number[][]): PerioInputRecord {
    const record: PerioInputRecord = {} as PerioInputRecord;
    for(let i=0; i<values.length; i++) {
      for(let j=0; j<values[i].length; j++) {
        const key = this.mapping[i][j];
        record[key] = values[i][j];
      }
    }
    return record;
  }
  updator(r: number, c: number, v: number): (data: PerioInputRecord) => PerioInputRecord {
    const key = this.mapping[r][c];
    return (data: PerioInputRecord) => ({ ...data, [key]: v });
  }
}
