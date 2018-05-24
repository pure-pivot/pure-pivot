export type Comparator<D> = (data1: D[], data2: D[]) => number;

export type Comparators<D> = Comparator<D>[];
