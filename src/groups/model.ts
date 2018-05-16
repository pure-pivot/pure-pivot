export interface LabeledData<D> {
    label: string;
    data: D[];
}

export interface Grouper<D> {
    id: string;
    label: string;
    grouper: (data: D[]) => LabeledData<D>[];
}

export type Groups<D> = Grouper<D>[];
