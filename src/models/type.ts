export type ModelInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type ModelUpdate<T> = Partial<ModelInput<T>> & { id: string };
