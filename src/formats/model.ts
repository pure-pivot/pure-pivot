export type FormattedData<D> = { [Key in keyof D]: string };

export type ValueFormatter<D> = (row: D) => FormattedData<D>;

export type GroupFormatter<D> = (data: D[]) => FormattedData<D>;

export interface Formats<D> {
    valueFormatter: ValueFormatter<D>;
    groupFormatter: GroupFormatter<D>;
}
