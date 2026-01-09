
export type TVal = 'X' | 'O' | '-'; // 'X' = missing, 'O' = Selected, '-' = Skipped
export type Posi = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Quad = 1 | 2 | 3 | 4;
export type TKey = `${Quad}${Posi}`;

export type TeethInputRecord = Partial<Record<TKey, TVal>>;

export type TeethMappingType = TKey[][];

export class TeethSerializer {
  constructor(public mapping: TeethMappingType) {}
  serialize(data: TeethInputRecord): TVal[][] {
    return this.mapping.map(group => group.map(key => (data[key] || '-')));
  }
  deserialize(values: TVal[][]): TeethInputRecord {
    const record: TeethInputRecord = {} as TeethInputRecord;
    for(let i=0; i<values.length; i++) {
      for(let j=0; j<values[i].length; j++) {
        const key = this.mapping[i][j];
        record[key] = values[i][j];
      }
    }
    return record;
  }
  updator(r: number, c: number, v: { xnjud: string }): (data: TeethInputRecord) => TeethInputRecord {
    const key = this.mapping[r][c];
    return (data: TeethInputRecord) => ({ ...data, [key]: v });
  }
}
