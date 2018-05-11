export interface CountAggregate {
    type: 'count';
}

export type AnyAggregate = CountAggregate;

export function isAnyAggregate(object: Aggregate<any> | AnyAggregate): object is AnyAggregate {
    return object.type === 'count';
}

export interface BooleanOrAggregate {
    type: 'boolean-or';
}

export interface BooleanAndAggregate {
    type: 'boolean-and';
}

export type BooleanAggregate = BooleanOrAggregate | BooleanAndAggregate;

export function isBooleanAggregate(object: Aggregate<any>): object is BooleanAggregate {
    return object.type === 'boolean-or' || object.type === 'boolean-and';
}

export interface NumberMaximumAggregate {
    type: 'number-maximum';
}

export interface NumberMinimumAggregate {
    type: 'number-minimum';
}

export interface NumberAverageAggregate {
    type: 'number-average';
}

export interface NumberSumAggregate {
    type: 'number-sum';
}

export type NumberAggregate = NumberMaximumAggregate | NumberMinimumAggregate | NumberAverageAggregate | NumberSumAggregate;

export function isNumberAggregate(object: Aggregate<any>): object is NumberAggregate {
    return object.type === 'number-maximum' || object.type === 'number-minimum' || object.type === 'number-average' || object.type === 'number-sum';
}

export interface StringJoinAggregate {
    type: 'string-join';
    joiner: string;
}

export type StringAggregate = StringJoinAggregate;

export function isStringAggregate(object: Aggregate<any>): object is StringAggregate {
    return object.type === 'string-join';
}

export interface OtherAggregate<T> {
    type: 'other';
    reducer: (values: T[]) => T;
}

export function isOtherAggregate(object: Aggregate<any>): object is OtherAggregate<any> {
    return object.type === 'other';
}

export type Aggregate<T> =
    T extends boolean ? BooleanAggregate :
    T extends number ? NumberAggregate :
    T extends string ? StringAggregate :
    OtherAggregate<T>;

export interface AggregateDescription<D, F extends keyof D> {
    id: string;
    name: F;
    aggregate: Aggregate<D[F]> | AnyAggregate;
}

export type Aggregates<D> = AggregateDescription<D, keyof D>[];
