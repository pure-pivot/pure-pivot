import { Groups } from './model';

export function defaultGrouper<D>(data: D[]): D[][] {
    return data.map((row) => [row]);
}

export function inferGroups<D>(): Groups<D> {
    return [defaultGrouper];
}
