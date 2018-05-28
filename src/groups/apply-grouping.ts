import { Groups } from './model';
import { assertOrThrow, isNumber } from '../util/assertion';

export interface Grouping {
    recursiveGroups: RecursiveGroup[];
    sortedIndices: number[];
    groupDataIndices: (indices?: number[]) => number[][];
}

export interface RecursiveGroup {
    groupId: string;
    groupIndex: number;
    label: string;
    dataIndexStart: number;
    dataIndexEnd: number;
    subGroupCount: number;
    childGroups?: RecursiveGroup[];
}

export function applyGrouping<T>(groups: Groups<T>, data: T[]): Grouping {
    const encodedIndices: number[] = [];
    const labels: string[][] = [];
    const factors: number[] = [];

    for (let i = 0; i < data.length; i++) {
        encodedIndices[i] = 0;
    }

    let multiplier = 1;
    for (let i = groups.length - 1; i >= 0; i--) {
        const group = groups[i];
        const groupedData = group.grouper(data);
        for (let j = 0; j < data.length; j++) {
            encodedIndices[j] += multiplier * groupedData.groupIndices[j];
        }
        labels[i] = groupedData.groupLabels;
        factors[i] = multiplier;
        multiplier *= groupedData.groupLabels.length;
    }
    const minFactor = assertOrThrow(factors.pop(), isNumber);
    const maxFactor = multiplier;

    const uniqueEncodedIndices = Array.from(new Set(encodedIndices)).sort((a, b) => a - b);

    const sortedIndices: number[] = [];
    for (let i = 0; i < data.length; i++) {
        sortedIndices.push(i);
    }
    sortedIndices.sort((indexA, indexB) => encodedIndices[indexA] - encodedIndices[indexB]);

    const recursiveGroups: RecursiveGroup[] = [];
    const recursiveGroupsStack: RecursiveGroup[][] = [recursiveGroups];
    let previousFactor: number = maxFactor;
    let currentFactor: number = factors[0];
    for (let i = 0, level = 0; i < sortedIndices.length;) {
        // Zoom out
        while (i !== 0 && Math.floor(encodedIndices[sortedIndices[i - 1]] / previousFactor) !== Math.floor(encodedIndices[sortedIndices[i]] / previousFactor)) {
            level -= 1;
            previousFactor = level === 0 ? maxFactor : factors[level - 1];
            recursiveGroupsStack.pop();
        }
        currentFactor = level === factors.length ? minFactor : factors[level];
        // Zoom in
        while (level !== groups.length - 1) {
            const group = {
                groupId: groups[level].id,
                groupIndex: Math.floor(encodedIndices[sortedIndices[i]] % previousFactor / currentFactor),
                label: labels[level][Math.floor(encodedIndices[sortedIndices[i]] % previousFactor / currentFactor)],
                dataIndexStart: i,
                dataIndexEnd: 0,
                subGroupCount: 0,
                childGroups: []
            };
            recursiveGroupsStack[recursiveGroupsStack.length - 1].push(group);
            recursiveGroupsStack.push(group.childGroups);
            level += 1;
            previousFactor = level === 0 ? maxFactor : factors[level - 1];
            currentFactor = level === factors.length ? minFactor : factors[level];
        }
        // Count
        const start = i;
        while (i < sortedIndices.length && (i === start || encodedIndices[sortedIndices[i - 1]] === encodedIndices[sortedIndices[i]])) {
            i += 1;
        }
        // Update
        recursiveGroupsStack[recursiveGroupsStack.length - 1].push({
            groupId: groups[level].id,
            groupIndex: Math.floor(encodedIndices[sortedIndices[start]] % previousFactor / currentFactor),
            label: labels[level][Math.floor(encodedIndices[sortedIndices[start]] % previousFactor / currentFactor)],
            dataIndexStart: start,
            dataIndexEnd: i,
            subGroupCount: 1
        });
    }

    (function fixEndsAndCounts(recursiveGroups: RecursiveGroup[]) {
        for (const recursiveGroup of recursiveGroups) {
            if (recursiveGroup.childGroups) {
                fixEndsAndCounts(recursiveGroup.childGroups);
                recursiveGroup.dataIndexEnd = recursiveGroup.childGroups[recursiveGroup.childGroups.length - 1].dataIndexEnd;
                recursiveGroup.subGroupCount = recursiveGroup.childGroups.reduce((sum, child) => sum + child.subGroupCount, 0);
            }
        }
    })(recursiveGroups);

    const groupDataIndices = (indices?: number[]): number[][] => {
        const mapping: { [Key: number]: number[] } = {};

        for (const encodedIndex of uniqueEncodedIndices) {
            mapping[encodedIndex] = [];
        }

        if (indices) {
            for (const index of indices) {
                mapping[encodedIndices[index]].push(index);
            }
        } else {
            for (let i = 0; i < encodedIndices.length; i++) {
                mapping[encodedIndices[i]].push(i);
            }
        }

        return uniqueEncodedIndices.map((encodedIndex) => mapping[encodedIndex]);
    };

    return {
        recursiveGroups,
        sortedIndices,
        groupDataIndices
    };
}
