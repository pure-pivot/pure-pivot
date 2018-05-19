import { Groups } from './model';

export interface Heading {
    label: string;
    count: number;
}

export interface GroupLabels {
    id: string;
    label: string;
    headings: Heading[];
}

export interface Grouping {
    labelsByGroup: GroupLabels[];
    groupDataIndices: (indices?: number[]) => number[][];
}

export function applyGrouping<T>(groups: Groups<T>, data: T[]): Grouping {
    const encodedIndices: number[] = [];
    const labels: string[][] = [];
    const factors: number[] = [];

    let multiplier = 1;
    for (let i = groups.length - 1; i >= 0; i--) {
        const group = groups[i];
        const groupedData = group.grouper(data);
        for (let j = 0; j < data.length; j++) {
            if (encodedIndices[j] === undefined) {
                encodedIndices[j] = 0;
            }
            encodedIndices[j] += multiplier * groupedData.groupIndices[j];
        }
        labels[i] = groupedData.groupLabels;
        factors[i] = multiplier;
        multiplier *= groupedData.groupLabels.length;
    }
    factors.pop();

    const uniqueEncodedIndices = Array.from(new Set(encodedIndices)).sort((a, b) => a - b);
    const uniqueIndices = uniqueEncodedIndices.map((encodedIndex) => {
        const indices: number[] = [];
        for (const factor of factors) {
            const index = Math.floor(encodedIndex / factor);
            indices.push(index);
            encodedIndex -= index * factor;
        }
        indices.push(encodedIndex);
        return indices;
    });

    const unqiueIndexLabelCounts: { label: string, count: number }[][] = [];
    for (let i = 0; i < labels.length; i++) {
        unqiueIndexLabelCounts[i] = [];
    }

    for (let i = 0; i < uniqueIndices.length; i++) {
        let changed = i === 0;
        for (let j = 0; j < labels.length; j++) {
            if (changed || uniqueIndices[i - 1][j] !== uniqueIndices[i][j]) {
                unqiueIndexLabelCounts[j].push({
                    count: 1,
                    label: labels[j][uniqueIndices[i][j]]
                });
                changed = true;
            } else {
                unqiueIndexLabelCounts[j][unqiueIndexLabelCounts[j].length - 1].count += 1;
            }
        }
    }

    const labelsByGroup: GroupLabels[] = groups.map((group, groupIndex) => ({
        id: group.id,
        label: group.label,
        headings: unqiueIndexLabelCounts[groupIndex]
    }));

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
        labelsByGroup,
        groupDataIndices
    };
}
