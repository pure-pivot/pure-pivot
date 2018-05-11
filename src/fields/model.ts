export type FieldBoolean = 'boolean';

export type FieldNumber = 'number';

export type FieldString = 'string';

export type FieldOther = 'other';

export type AnyField = FieldBoolean | FieldNumber | FieldString | FieldOther;

export type Field<T> =
    T extends boolean ? FieldBoolean :
    T extends number ? FieldNumber :
    T extends string ? FieldString :
    FieldOther;

export type Fields<D> = { [Key in keyof D]: Field<D[Key]> };
