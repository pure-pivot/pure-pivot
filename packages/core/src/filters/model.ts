export type Filter<D> = (data: D[]) => D[];

export type Filters<D> = Filter<D>[];
