import { Groups } from './model';

export interface GroupLabelAndCount {
    label: string;
    count: number;
}

export type GroupLabelsAndCounts = GroupLabelAndCount[];

export type GroupLabelsAndCountsByLevel = GroupLabelsAndCounts[];

// export interface GroupLabelsRecursiveIndex {
//     label: string;
//     nested: GroupLabelsRecursive;
// }

// export interface GroupLabelsRecursive extends Array<GroupLabelsRecursiveIndex> { }

export class Grouping<T> {
    private encodedIndices: number[];
    private labels: string[][];
    private factors: number[];
    private uniqueEncodedIndices: number[] | undefined = undefined;
    private uniqueIndices: number[][] | undefined = undefined;
    private unqiueIndexLabelCounts: GroupLabelsAndCountsByLevel | undefined = undefined;
    // private uniqueLabelsRecursive: GroupLabelsRecursive | undefined = undefined;

    constructor(groups: Groups<T>, data: T[]) {
        this.encodedIndices = [];
        this.labels = [];
        this.factors = [];

        let multiplier = 1;
        for (let i = groups.length - 1; i >= 0; i--) {
            const group = groups[i];
            const groupedData = group.grouper(data);
            for (let j = 0; j < data.length; j++) {
                if (this.encodedIndices[j] === undefined) {
                    this.encodedIndices[j] = 0;
                }
                this.encodedIndices[j] += multiplier * groupedData.groupIndices[j];
            }
            this.labels[i] = groupedData.groupLabels;
            this.factors[i] = multiplier;
            multiplier *= groupedData.groupLabels.length;
        }

        this.factors.pop();
    }

    getUniqueIndices(): number[][] {
        if (this.uniqueIndices === undefined) {
            this.uniqueIndices = this.getUniqueEncodedIndices().map((encodedIndex) => this.decodeIndex(encodedIndex));
        }
        return this.uniqueIndices;
    }

    getUniqueIndexLabelCounts(): GroupLabelsAndCountsByLevel {
        if (!this.unqiueIndexLabelCounts) {
            this.unqiueIndexLabelCounts = [];

            for (let i = 0; i < this.labels.length; i++) {
                this.unqiueIndexLabelCounts[i] = [];
            }

            const uniqueIndicesByLevel = this.getUniqueIndices();
            for (let i = 0; i < uniqueIndicesByLevel.length; i++) {
                let changed = i === 0;
                for (let j = 0; j < this.labels.length; j++) {
                    if (changed || uniqueIndicesByLevel[i - 1][j] !== uniqueIndicesByLevel[i][j]) {
                        this.unqiueIndexLabelCounts[j].push({
                            count: 1,
                            label: this.labels[j][uniqueIndicesByLevel[i][j]]
                        });
                        changed = true;
                    } else {
                        this.unqiueIndexLabelCounts[j][this.unqiueIndexLabelCounts[j].length - 1].count += 1;
                    }
                }
            }
        }
        return this.unqiueIndexLabelCounts;
    }

    private decodeIndex(encodedIndex: number): number[] {
        const indices: number[] = [];
        for (const factor of this.factors) {
            const index = Math.floor(encodedIndex / factor);
            indices.push(index);
            encodedIndex -= index * factor;
        }
        indices.push(encodedIndex);
        return indices;
    }

    private getUniqueEncodedIndices(): number[] {
        if (this.uniqueEncodedIndices === undefined) {
            this.uniqueEncodedIndices = Array.from(new Set(this.encodedIndices)).sort((a, b) => a - b);
        }
        return this.uniqueEncodedIndices;
    }

    // getValuesWithGroupIndex()

    // getUniqueIndexRecursiveLabels() {
    //     if (!this.uniqueLabelsRecursive) {
    //         this.uniqueLabelsRecursive = [];
    //         const uniqueIndicesByLevel = this.getUniqueIndices();
    //         const stack = [this.uniqueLabelsRecursive];

    //         for (let i = 0; i < uniqueIndicesByLevel.length; i++) {
    //             let changed = i === 0;
    //             for (let j = 0; j < this.labels.length; j++) {
    //                 if (changed || uniqueIndicesByLevel[i - 1][j] !== uniqueIndicesByLevel[i][j]) {
    //                     stack[j].push({
    //                         label: this.labels[j][uniqueIndicesByLevel[i][j]],
    //                         nested: []
    //                     });
    //                     changed = true;
    //                 }
    //                 stack[j + 1] = stack[j][stack[j].length - 1].nested;
    //             }
    //             for (const label of this.labels) {
    //                 stack.pop();
    //             }
    //         }
    //     }
    //     return this.uniqueLabelsRecursive;
    // }
}
