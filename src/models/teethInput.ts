
export type TVal = 'X' | 'O' | '-'; // 'X' = missing, 'O' = Selected, '-' = Skipped
export type Posi = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Quad = 1 | 2 | 3 | 4;
export type TKey = `${Quad}${Posi}`;

export type TeethInputRecord<T> = Partial<Record<TKey, T>>;

export type TeethMappingType = TKey[][];

export class TeethSerializer<T> {
  constructor(public mapping: TeethMappingType) {}
  serialize(data: TeethInputRecord<T>, defaultValue: T): T[][] {
    return this.mapping.map(group => group.map(key => (data[key] || defaultValue)));
  }
  deserialize(values: T[][]): TeethInputRecord<T> {
    const record: TeethInputRecord<T> = {} as TeethInputRecord<T>;
    for(let i=0; i<values.length; i++) {
      for(let j=0; j<values[i].length; j++) {
        const key = this.mapping[i][j];
        record[key] = values[i][j];
      }
    }
    return record;
  }
  updator(r: number, c: number, v: T): (data: TeethInputRecord<T>) => TeethInputRecord<T> {
    const key = this.mapping[r][c];
    return (data: TeethInputRecord<T>) => ({ ...data, [key]: v });
  }
}
