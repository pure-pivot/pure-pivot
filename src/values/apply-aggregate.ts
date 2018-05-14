import { Aggregate, AnyAggregate, isAnyAggregate, isBooleanAggregate, isNumberAggregate, isStringAggregate, isOtherAggregate } from './model';
import { assertOrThrow, isBoolean, isNumber, isString } from '../util/assertion';

export function applyAggregate<T>(aggregate: Aggregate<T> | AnyAggregate, values: T[]): number | string | boolean | T {
    if (isAnyAggregate(aggregate)) {
        return values.length;
    } else if (isBooleanAggregate(aggregate)) {
        if (aggregate.type === 'boolean-or') {
            return values.reduce((accumulator, value) => accumulator || assertOrThrow(value, isBoolean), false);
        } else {
            return values.reduce((accumulator, value) => accumulator && assertOrThrow(value, isBoolean), true);
        }
    } else if (isNumberAggregate(aggregate)) {
        if (aggregate.type === 'number-maximum') {
            return values.reduce((accumulator, value) => Math.max(accumulator, assertOrThrow(value, isNumber)), Number.NEGATIVE_INFINITY);
        } else if (aggregate.type === 'number-minimum') {
            return values.reduce((accumulator, value) => Math.min(accumulator, assertOrThrow(value, isNumber)), Number.POSITIVE_INFINITY);
        } else if (aggregate.type === 'number-average') {
            return values.reduce((accumulator, value) => accumulator + assertOrThrow(value, isNumber), 0) / values.length;
        } else {
            return values.reduce((accumulator, value) => accumulator + assertOrThrow(value, isNumber), 0);
        }
    } else if (isStringAggregate(aggregate)) {
        return values.map((value) => assertOrThrow(value, isString)).join(aggregate.joiner);
    } else if (isOtherAggregate(aggregate)) {
        return aggregate.reducer(values) as T;
    } else {
        throw new Error('Unknown aggregate type: ' + aggregate.type);
    }
}
