export interface StringEqualsOperator {
    type: 'string-equals';
    value: string;
}

export interface StringNotEqualsOperator {
    type: 'string-not-equals';
    value: string;
}

export type StringOperators = StringEqualsOperator | StringNotEqualsOperator;

export function isStringOperators(object: Operator): object is StringOperators {
    return object.type === 'string-equals' || object.type === 'string-not-equals';
}

export interface NumberEqualsOperator {
    type: 'number-equals';
    value: number;
}

export interface NumberNotEqualsOperator {
    type: 'number-not-equals';
    value: number;
}

export type NumberOperators = NumberEqualsOperator | NumberNotEqualsOperator;

export function isNumberOperators(object: Operator): object is NumberOperators {
    return object.type === 'number-equals' || object.type === 'number-not-equals';
}

export interface DateEqualsOperator {
    type: 'date-equals';
    value: number;
}

export interface DateNotEqualsOperator {
    type: 'date-not-equals';
    value: number;
}

export type DateOperators = DateEqualsOperator | DateNotEqualsOperator;

export function isDateOperators(object: Operator): object is DateOperators {
    return object.type === 'date-equals' || object.type === 'date-not-equals';
}

export interface BooleanEqualsOperator {
    type: 'boolean-equals';
    value: boolean;
}

export interface BooleanNotEqualsOperator {
    type: 'boolean-not-equals';
    value: boolean;
}

export type BooleanOperators = BooleanEqualsOperator | BooleanNotEqualsOperator;

export function isBooleanOperators(object: Operator): object is BooleanOperators {
    return object.type === 'boolean-equals' || object.type === 'boolean-not-equals';
}

export type Operator = StringOperators | NumberOperators | DateOperators | BooleanOperators;

export type FieldType = 'string' | 'boolean' | 'number' | 'date';

export interface Field {
    type: FieldType;
    label: string;
}

export interface Fields {
    [Key: string]: Field;
}

export interface Filter {
    fieldId: string;
    operator: Operator;
}

export interface Filters {
    [Key: string]: Filter;
}
