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
