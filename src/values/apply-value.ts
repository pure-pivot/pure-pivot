import { Value, AnyValue, isAnyValue, isBooleanValue, isNumberValue, isStringValue, isOtherValue } from './model';
import { assertOrThrow, isBoolean, isNumber, isString } from '../util/assertion';

export function applyValue<T>(value: Value<T> | AnyValue, values: T[], format: (value: T) => string): string {
    const anyFormat = format as (value: any) => string;
    if (isAnyValue(value)) {
        return values.length.toString();
    } else if (isBooleanValue(value)) {
        if (value.type === 'boolean-or') {
            return anyFormat(values.reduce((accumulator, value) => accumulator || assertOrThrow(value, isBoolean), false));
        } else {
            return anyFormat(values.reduce((accumulator, value) => accumulator && assertOrThrow(value, isBoolean), true));
        }
    } else if (isNumberValue(value)) {
        if (value.type === 'number-maximum') {
            return anyFormat(values.reduce((accumulator, value) => Math.max(accumulator, assertOrThrow(value, isNumber)), Number.NEGATIVE_INFINITY));
        } else if (value.type === 'number-minimum') {
            return anyFormat(values.reduce((accumulator, value) => Math.min(accumulator, assertOrThrow(value, isNumber)), Number.POSITIVE_INFINITY));
        } else if (value.type === 'number-average') {
            return anyFormat(values.reduce((accumulator, value) => accumulator + assertOrThrow(value, isNumber), 0) / values.length);
        } else {
            return anyFormat(values.reduce((accumulator, value) => accumulator + assertOrThrow(value, isNumber), 0));
        }
    } else if (isStringValue(value)) {
        return anyFormat(values.map((value) => assertOrThrow(value, isString)).join(value.joiner));
    } else if (isOtherValue(value)) {
        return anyFormat(value.reducer(values));
    } else {
        throw new Error('Unknown value type: ' + value.type);
    }
}
