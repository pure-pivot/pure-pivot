import { Grouping } from './apply-groups';
import { Groups } from './model';

function extractLabelsRecursive<T>(grouping: Grouping<T>, level: number, labelsByLevelAccumuator: Set<string>[]) {
    if (grouping.type === 'nested') {
        for (const nestedGrouping of grouping.data) {
            labelsByLevelAccumuator[level].add(nestedGrouping.label);
            extractLabelsRecursive(nestedGrouping.data, level + 1, labelsByLevelAccumuator);
        }
    }
}

export function extractLabels<T>(levels: number, grouping: Grouping<T>): string[][] {
    const labelsByLevel: Set<string>[] = [];

    for (let i = 0; i < levels; i++) {
        labelsByLevel.push(new Set());
    }

    extractLabelsRecursive(grouping, 0, labelsByLevel);

    return labelsByLevel.map((labels) => Array.from(labels));
}

function countLabelsRecursive<T>(grouping: Grouping<T>, level: number, labelCountsAccumulator: { label: string, count: number }[][]): number {
    if (grouping.type === 'nested') {
        let total = 0;
        const labelCounts: { label: string, count: number }[] = [];
        for (const nestedGrouping of grouping.data) {
            const count = countLabelsRecursive(nestedGrouping.data, level + 1, labelCountsAccumulator);
            labelCounts.push({
                count,
                label: nestedGrouping.label
            });
            total += count;
        }
        if (!labelCountsAccumulator[level]) {
            labelCountsAccumulator[level] = [];
        }
        labelCountsAccumulator[level] = labelCountsAccumulator[level].concat(labelCounts);
        return total;
    } else {
        return 1;
    }
}

export function countLabels<T>(grouping: Grouping<T>): { label: string, count: number }[][] {
    const accumulator: { label: string, count: number }[][] = [];
    countLabelsRecursive(grouping, 0, accumulator);
    return accumulator;
}
