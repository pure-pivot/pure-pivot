export interface GroupByIdentity {
    type: 'identity';
}

export interface GroupByBooleanEquality {
    type: 'boolean-equality';
}

export function isGroupByBooleanEquality(object: GroupBy<any>): object is GroupByBooleanEquality {
    return object.type === 'boolean-equality';
}

export type GroupByBoolean = GroupByBooleanEquality;

export interface GroupByNumberEquality {
    type: 'number-equality';
}

export function isGroupByNumberEquality(object: GroupBy<any>): object is GroupByNumberEquality {
    return object.type === 'number-equality';
}

export interface GroupByNumberCount {
    type: 'number-count';
    count: number;
}

export function isGroupByNumberCount(object: GroupBy<any>): object is GroupByNumberCount {
    return object.type === 'number-count';
}

export interface GroupByNumberRange {
    type: 'number-range';
    range: number;
}

export function isGroupByNumberRange(object: GroupBy<any>): object is GroupByNumberRange {
    return object.type === 'number-range';
}

export type GroupByNumber = GroupByNumberEquality | GroupByNumberCount | GroupByNumberRange;

export interface GroupByStringEquality {
    type: 'string-equality';
}

export function isGroupByStringEquality(object: GroupBy<any>): object is GroupByStringEquality {
    return object.type === 'string-equality';
}

export type GroupByString = GroupByStringEquality;

export interface GroupByOtherEquality<T> {
    type: 'other-equality';
    createGroups: (values: T[]) => { label: string, values: T[] }[];
}

export function isGroupByOtherEquality(object: GroupBy<any>): object is GroupByOtherEquality<any> {
    return object.type === 'other-equality';
}

export type GroupByOther<T> = GroupByOtherEquality<T>;

export type GroupBy<T> =
    T extends boolean ? GroupByBoolean :
    T extends number ? GroupByNumber :
    T extends string ? GroupByString :
    GroupByOther<T>;

export interface GroupByDescription<D, F extends keyof D> {
    type: 'description';
    name: F;
    groupBy: GroupBy<D[F]>;
}

export type GroupByValue<D, F extends keyof D> = GroupByIdentity | GroupByDescription<D, F>;
