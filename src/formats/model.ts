export type BooleanFormat = ((value: boolean) => string) | 'yes-no';

export type NumberFormat = ((value: number) => string) | 'number' | 'date' | 'time' | 'date-time';

export type StringFormat = ((value: string) => string) | 'text';

export type OtherFormat<T> = 'empty' | ((value: T) => string);

export type AnyFormat = BooleanFormat | NumberFormat | StringFormat | OtherFormat<any>;

export type Format<T> =
    T extends boolean ? BooleanFormat :
    T extends number ? NumberFormat :
    T extends string ? StringFormat :
    OtherFormat<T>;

export type Formats<D> = { [Key in keyof D]: Format<D[Key]> };
