export interface GroupedData<D> {
    groupIndices: number[];
    groupLabels: string[];
}

export interface Grouper<D> {
    id: string;
    label: string;
    grouper: (data: D[]) => GroupedData<D>;
}

export type Groups<D> = Grouper<D>[];
