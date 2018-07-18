import { assertOrThrow, isString, isNumber, isBoolean } from '@pure-pivot/core/lib/es6/util/assertion';
import { Operator, StringEqualsOperator, StringNotEqualsOperator, NumberEqualsOperator, NumberNotEqualsOperator, BooleanEqualsOperator, BooleanNotEqualsOperator, DateEqualsOperator, DateNotEqualsOperator, StringContainsOperator, NumberSmallerThanOperator, NumberGreaterThanOperator, DateBeforeOperator, DateAfterOperator, IsEmptyOperator, IsNotEmptyOperator } from './model';

function isEmpty(value: any) {
    return value === undefined || value === null || value === '';
}

export function applyStringEqualsOperator(operator: StringEqualsOperator, value: string) {
    return operator.value === value;
}

export function applyStringNotEqualsOperator(operator: StringNotEqualsOperator, value: string) {
    return operator.value !== value;
}

export function applyStringContainsOperator(operator: StringContainsOperator, value: string) {
    return value.indexOf(operator.value) >= 0;
}

export function applyNumberEqualsOperator(operator: NumberEqualsOperator, value: number) {
    return operator.value === value;
}

export function applyNumberNotEqualsOperator(operator: NumberNotEqualsOperator, value: number) {
    return operator.value !== value;
}

export function applyNumberSmallerThanOperator(operator: NumberSmallerThanOperator, value: number) {
    return value < operator.value;
}

export function applyNumberGreaterThanOperator(operator: NumberGreaterThanOperator, value: number) {
    return value > operator.value;
}

export function applyBooleanEqualsOperator(operator: BooleanEqualsOperator, value: boolean) {
    return operator.value === value;
}

export function applyBooleanNotEqualsOperator(operator: BooleanNotEqualsOperator, value: boolean) {
    return operator.value !== value;
}

export function applyDateEqualsOperator(operator: DateEqualsOperator, value: number) {
    return operator.value === value;
}

export function applyDateNotEqualsOperator(operator: DateNotEqualsOperator, value: number) {
    return operator.value !== value;
}

export function applyDateBeforeOperator(operator: DateBeforeOperator, value: number) {
    return value < operator.value;
}

export function applyDateAfterOperator(operator: DateAfterOperator, value: number) {
    return value > operator.value;
}

export function applyIsEmptyOperator(operator: IsEmptyOperator, value: any) {
    return isEmpty(value);
}

export function applyIsNotEmptyOperator(operator: IsNotEmptyOperator, value: any) {
    return !isEmpty(value);
}

export function applyOperator(operator: Operator, value: any): boolean {
    if (operator.type !== 'is-empty' && operator.type !== 'is-not-empty') {
        if (isEmpty(value)) {
            return false;
        }
    }
    switch (operator.type) {
        case 'string-equals':
            return applyStringEqualsOperator(operator, assertOrThrow(value, isString));
        case 'string-not-equals':
            return applyStringNotEqualsOperator(operator, assertOrThrow(value, isString));
        case 'string-contains':
            return applyStringContainsOperator(operator, assertOrThrow(value, isString));
        case 'number-equals':
            return applyNumberEqualsOperator(operator, assertOrThrow(value, isNumber));
        case 'number-not-equals':
            return applyNumberNotEqualsOperator(operator, assertOrThrow(value, isNumber));
        case 'number-smaller-than':
            return applyNumberSmallerThanOperator(operator, assertOrThrow(value, isNumber));
        case 'number-greater-than':
            return applyNumberGreaterThanOperator(operator, assertOrThrow(value, isNumber));
        case 'boolean-equals':
            return applyBooleanEqualsOperator(operator, assertOrThrow(value, isBoolean));
        case 'boolean-not-equals':
            return applyBooleanNotEqualsOperator(operator, assertOrThrow(value, isBoolean));
        case 'date-equals':
            return applyDateEqualsOperator(operator, assertOrThrow(value, isNumber));
        case 'date-not-equals':
            return applyDateNotEqualsOperator(operator, assertOrThrow(value, isNumber));
        case 'date-before':
            return applyDateBeforeOperator(operator, assertOrThrow(value, isNumber));
        case 'date-after':
            return applyDateAfterOperator(operator, assertOrThrow(value, isNumber));
        case 'is-empty':
            return applyIsEmptyOperator(operator, value);
        case 'is-not-empty':
            return applyIsNotEmptyOperator(operator, value);
    }
}
