export interface BinaryFilterBooleanAnd<T> {
    type: 'and';
    left: Filter<T>;
    right: Filter<T>;
}

export interface UnaryFilterNot<T> {
    type: 'not';
    filter: Filter<T>;
}

export interface NullaryFilterEquals<T> {
    type: 'equals';
    value: T;
}

export type Filter<T> = BinaryFilterBooleanAnd<T> | NullaryFilterEquals<T> | UnaryFilterNot<T>;

export interface FilterDescription<D, F extends keyof D> {
    id: string;
    name: F;
    filter: Filter<D[F]>;
}

export type Filters<D> = FilterDescription<D, keyof D>[];
