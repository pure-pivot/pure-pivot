export interface FilterBooleanEquals {
    type: 'boolean-equals';
    value: boolean;
}

export type FilterBoolean = FilterBooleanEquals;

export interface FilterNumberEquals {
    type: 'number-equals';
    value: number;
}

export interface FilterNumberGreaterThan {
    type: 'number-greater-than';
    value: number;
}

export interface FilterNumberSmallerThan {
    type: 'number-smaller-than';
    value: number;
}

export type FilterNumber = FilterNumberEquals | FilterNumberGreaterThan | FilterNumberSmallerThan;

export interface FilterStringEquals {
    type: 'string-equals';
    value: string;
}

export type FilterString = FilterStringEquals;

export type Filter<T> =
    T extends boolean ? FilterBoolean :
    T extends number ? FilterNumber :
    T extends string ? FilterString :
    never;

export interface FilterDescription<D, F extends keyof D> {
    filter: Filter<D[F]>;
    fieldName: F;
}

export type Filters<D> = FilterDescription<D, keyof D>[];

const filters: Filters<{ time: number, text: string }> = [];
const filter = filters[0];
if (filter.fieldName === 'time') {
    const foo = filter.filter.type; // TODO: number type only
}
