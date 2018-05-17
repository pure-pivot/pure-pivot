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

    let multiplier = 1;
    for (let i = groups.length - 1; i >= 0; i--) {
        const group = groups[i];
        const groupedData = group.grouper(data);
        for (let j = 0; j < data.length; j++) {
            if (combinedGrouping.indices[j] === undefined) {
                combinedGrouping.indices[j] = 0;
            }
            combinedGrouping.indices[j] += multiplier * groupedData.groupIndices[j];
        }
        combinedGrouping.labels[i] = groupedData.groupLabels;
        combinedGrouping.factors[i] = multiplier;
        multiplier *= groupedData.groupLabels.length;
    }

    combinedGrouping.factors.pop();

    return combinedGrouping;
}

export function countUniqueLabels(combinedGrouping: CombinedGrouping, uniqueIndices: number[][]): { count: number, label: string }[][] {
    const result: { count: number, label: string }[][] = [];

    for (let i = 0; i < combinedGrouping.labels.length; i++) {
        result[i] = [];
    }

    for (let i = 0; i < uniqueIndices.length; i++) {
        let changed = i === 0;
        for (let j = 0; j < combinedGrouping.labels.length; j++) {
            if (changed || uniqueIndices[i - 1][j] !== uniqueIndices[i][j]) {
                result[j].push({
                    count: 1,
                    label: combinedGrouping.labels[j][uniqueIndices[i][j]]
                });
                changed = true;
            } else {
                result[j][result[j].length - 1].count += 1;
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
