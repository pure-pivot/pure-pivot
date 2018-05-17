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

export interface CombinedGrouping {
    indices: number[];
    labels: string[][];
    factors: number[];
}

export function applyGroups<T>(groups: Groups<T>, data: T[]): CombinedGrouping {
    const combinedGrouping: CombinedGrouping = {
        indices: [],
        labels: [],
        factors: []
    };

    for (let i = 0; i < data.length; i++) {
        combinedGrouping.indices[i] = 0;
    }

    let multiplier = 1;
    for (let i = groups.length - 1; i >= 0; i--) {
        const group = groups[i];
        const groupedData = group.grouper(data);
        for (let j = 0; j < data.length; j++) {
            combinedGrouping.indices[j] += multiplier * groupedData.groupIndices[j];
        }
        combinedGrouping.labels[i] = groupedData.groupLabels;
        combinedGrouping.factors[i] = multiplier;
        multiplier *= groupedData.groupLabels.length;
    }

    combinedGrouping.factors.pop();

    return combinedGrouping;
}

export function countUniqueLabels(combinedGrouping: CombinedGrouping, uniqueIndices: number[][]): number[][] {
    const result: number[][] = [];

    for (let i = 0; i < combinedGrouping.labels.length; i++) {
        result[i] = [1];
    }

    for (let i = 1; i < uniqueIndices.length; i++) {
        let changed = false;
        for (let j = 0; j < combinedGrouping.labels.length; j++) {
            if (changed || uniqueIndices[i - 1][j] !== uniqueIndices[i][j]) {
                result[j].push(1);
                changed = true;
            } else {
                result[j][result[j].length - 1] += 1;
            }
        }
    }

    return result;
}

// export function applyGroups<T>(groups: Groups<T>, data: T[]): CombinedGrouping {
//     const combinedGrouping: CombinedGrouping = {
//         indices: [],
//         labels: []
//     };

//     for (const row of data) {
//         combinedGrouping.indices.push([]);
//     }

//     for (let i = 0; i < groups.length; i++) {
//         const group = groups[i];
//         const groupedData = group.grouper(data);
//         for (let j = 0; j < data.length; j++) {
//             combinedGrouping.indices[j].push(groupedData.groupIndices[j]);
//         }
//         combinedGrouping.labels[i] = groupedData.groupLabels;
//     }

//     return combinedGrouping;
// }

// export function applyGroups<T>(groups: Groups<T>, data: T[]): Grouping<T> {
//     if (groups.length >= 1) {
//         const [head, ...tail] = groups;
//         return {
//             type: 'nested',
//             label: head.label,
//             data: head.grouper(data).map((grouping) => ({
//                 label: grouping.label,
//                 data: applyGroups(tail, grouping.data)
//             }))
//         };
//     } else {
//         return {
//             type: 'leaf',
//             data
//         };
//     }
// }
