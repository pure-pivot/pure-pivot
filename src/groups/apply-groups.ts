import { Groups } from './model';

export type Grouping<T> = LeafGrouping<T> | NestedGrouping<T>;

export interface LabeledGrouping<T> {
    label: string;
    data: Grouping<T>;
}

export interface LeafGrouping<T> {
    type: 'leaf';
    data: T[];
}

export interface NestedGrouping<T> {
    type: 'nested';
    data: LabeledGrouping<T>[];
    label: string;
}

export function applyGroups<T>(groups: Groups<T>, data: T[]): Grouping<T> {
    if (groups.length >= 1) {
        const [head, ...tail] = groups;
        return {
            type: 'nested',
            label: head.label,
            data: head.grouper(data).map((grouping) => ({
                label: grouping.label,
                data: applyGroups(tail, grouping.data)
            }))
        };
    } else {
        return {
            type: 'leaf',
            data
        };
    }
}
