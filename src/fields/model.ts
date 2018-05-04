export type Formats<T> =
    T extends number ? 'number' | 'date' | 'time' | 'date-time' :
    T extends string ? 'text' :
    T extends boolean ? 'yes-no' :
    T extends undefined ? 'undefined' :
    T extends null ? 'null' :
    'empty';

export type TypeName<T> =
    T extends number ? 'number' :
    T extends string ? 'string' :
    T extends boolean ? 'boolean' :
    T extends undefined ? 'undefined' :
    T extends null ? 'null' :
    'any';

export interface Field<T> {
    type: TypeName<T>;
    format: Formats<T> | ((value: T) => string);
}

export type Fields<D extends { [Key in keyof D]: D[Key] }> = { [Key in keyof D]: Field<D[Key]> };
