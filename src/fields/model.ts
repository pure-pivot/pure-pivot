export type FormatBoolean = ((value: boolean) => string) | 'yes-no';

export type FormatNumber = ((value: number) => string) | 'number' | 'date' | 'time' | 'date-time';

export type FormatString = ((value: string) => string) | 'text';

export interface FieldBoolean {
    type: 'boolean';
    format: FormatBoolean;
}

export interface FieldNumber {
    type: 'number';
    format: FormatNumber;
}

export interface FieldString {
    type: 'string';
    format: FormatString;
}

export interface FieldOther<T> {
    type: 'other';
    format: 'empty' | ((value: T) => string);
}

export type AnyField = FieldBoolean | FieldNumber | FieldString | FieldOther<any>;

export type Field<T> =
    T extends boolean ? FieldBoolean :
    T extends number ? FieldNumber :
    T extends string ? FieldString :
    FieldOther<T>;

export function isFieldBoolean(field: AnyField): field is FieldBoolean {
    return field.type === 'boolean';
}

export function isFieldNumber(field: AnyField): field is FieldNumber {
    return field.type === 'number';
}

export function isFieldString(field: AnyField): field is FieldString {
    return field.type === 'string';
}

export type Fields<D> = { [Key in keyof D]: Field<D[Key]> };
