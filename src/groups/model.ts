export type Grouper<D> = (data: D[]) => D[][];

export type Groups<D> = Grouper<D>[];
