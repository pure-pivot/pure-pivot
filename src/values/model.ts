export interface CountValue {
    type: 'count';
}

export type AnyValue = CountValue;

export function isAnyValue(object: Value<any> | AnyValue): object is AnyValue {
    return object.type === 'count';
}

export interface BooleanOrValue {
    type: 'boolean-or';
}

export interface BooleanAndValue {
    type: 'boolean-and';
}

export type BooleanValue = BooleanOrValue | BooleanAndValue;

export function isBooleanValue(object: Value<any>): object is BooleanValue {
    return object.type === 'boolean-or' || object.type === 'boolean-and';
}

export interface NumberMaximumValue {
    type: 'number-maximum';
}

export interface NumberMinimumValue {
    type: 'number-minimum';
}

export interface NumberAverageValue {
    type: 'number-average';
}

export interface NumberSumValue {
    type: 'number-sum';
}

export type NumberValue = NumberMaximumValue | NumberMinimumValue | NumberAverageValue | NumberSumValue;

export function isNumberValue(object: Value<any>): object is NumberValue {
    return object.type === 'number-maximum' || object.type === 'number-minimum' || object.type === 'number-average' || object.type === 'number-sum';
}

export interface StringJoinValue {
    type: 'string-join';
    joiner: string;
}

export type StringValue = StringJoinValue;

export function isStringValue(object: Value<any>): object is StringValue {
    return object.type === 'string-join';
}

export interface OtherValue<T> {
    type: 'other';
    reducer: (values: T[]) => T;
}

export function isOtherValue(object: Value<any>): object is OtherValue<any> {
    return object.type === 'other';
}

export type Value<T> =
    T extends boolean ? BooleanValue :
    T extends number ? NumberValue :
    T extends string ? StringValue :
    OtherValue<T>;

export interface ValueDescription<D, F extends keyof D> {
    id: string;
    name: F;
    value: Value<D[F]> | AnyValue;
}

export type Values<D> = ValueDescription<D, keyof D>[];
