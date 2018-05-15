import { GroupByDescription, isGroupByBooleanEquality, isGroupByNumberEquality, isGroupByNumberCount, isGroupByNumberRange, isGroupByStringEquality, isGroupByOtherEquality, GroupByNumberCount, GroupByNumberRange, GroupByValue } from './model';
import { partitionData } from '../util/partition';
import { assertOrThrow, isNumber } from '../util/assertion';
import { Formats } from '../formats/model';
import { applyFormat } from '../formats/apply-format';

export interface Group<D> {
    data: D[];
    label: string;
}

export type Groups<D> = Group<D>[];

export function applyGroupByEquality<D>(name: keyof D, data: D[], format: (value: D[keyof D]) => string): Groups<D> {
    return partitionData(data, (d1, d2) => d1[name] === d2[name]).map((data) => ({ data, label: format(data[0][name]) }));
}

export function applyGroupByNumberCount<D>(name: keyof D, data: D[], format: (value: D[keyof D]) => string, groupBy: GroupByNumberCount): Groups<D> {
    if (groupBy.count >= 1) {
        const min = data.reduce((min, row) => Math.min(min, assertOrThrow(row[name], isNumber)), Number.POSITIVE_INFINITY);
        const max = data.reduce((max, row) => Math.max(max, assertOrThrow(row[name], isNumber)), Number.NEGATIVE_INFINITY);
        const range = max - min;

        if (range > 0) {
            const groups: Groups<D> = [];
            for (let i = 0; i < groupBy.count; i++) {
                groups.push({
                    data: [],
                    label: `${format((min + range * i / groupBy.count) as any as D[keyof D])} - ${format((min + range * (i + 1) / groupBy.count) as any as D[keyof D])}`
                });
            }

            for (const row of data) {
                const groupIndex = Math.floor((assertOrThrow(row[name], isNumber) - min) / range * groupBy.count);
                if (groupIndex === groupBy.count) {
                    groups[groupBy.count - 1].data.push(row);
                } else {
                    groups[groupIndex].data.push(row);
                }
            }

            return groups;
        } else {
            return [{
                data,
                label: `${format(min as any as D[keyof D])} - ${format(max as any as D[keyof D])}`
            }];
        }
    } else {
        return [];
    }
}

export function applyGroupByNumberRange<D>(name: keyof D, data: D[], format: (value: D[keyof D]) => string, groupBy: GroupByNumberRange): Groups<D> {
    const min = data.reduce((min, row) => Math.min(min, assertOrThrow(row[name], isNumber)), Number.POSITIVE_INFINITY);
    const max = data.reduce((max, row) => Math.max(max, assertOrThrow(row[name], isNumber)), Number.NEGATIVE_INFINITY);
    const range = max - min;

    if (groupBy.range > 0) {
        if (range > 0) {
            const groups: Groups<D> = [];
            for (let i = min; i < max; i += groupBy.range) {
                groups.push({
                    data: [],
                    label: `${format(i as any as D[keyof D])} - ${format((i + groupBy.range) as any as D[keyof D])}`
                });
            }
            for (const row of data) {
                const groupIndex = Math.floor((assertOrThrow(row[name], isNumber) - min) / groupBy.range);
                if (groupIndex === groups.length) {
                    groups[groups.length - 1].data.push(row);
                } else {
                    groups[groupIndex].data.push(row);
                }
            }

            return groups;
        } else {
            return [{
                data,
                label: `${format(min as any as D[keyof D])} - ${format(max as any as D[keyof D])}`
            }];
        }
    } else {
        return [];
    }
}

export function applyGroupByDescription<D>(groupByDescription: GroupByDescription<D, keyof D>, data: D[], formats: Formats<D>): Groups<D> {
    const format = (value: D[keyof D]) => applyFormat(value, formats[groupByDescription.name]);

    if (isGroupByBooleanEquality(groupByDescription.groupBy)) {
        return applyGroupByEquality(groupByDescription.name, data, format);
    } else if (isGroupByNumberEquality(groupByDescription.groupBy)) {
        return applyGroupByEquality(groupByDescription.name, data, format);
    } else if (isGroupByNumberCount(groupByDescription.groupBy)) {
        return applyGroupByNumberCount(groupByDescription.name, data, format, groupByDescription.groupBy);
    } else if (isGroupByNumberRange(groupByDescription.groupBy)) {
        return applyGroupByNumberRange(groupByDescription.name, data, format, groupByDescription.groupBy);
    } else if (isGroupByStringEquality(groupByDescription.groupBy)) {
        return applyGroupByEquality(groupByDescription.name, data, format);
    } else if (isGroupByOtherEquality(groupByDescription.groupBy)) {
        return applyGroupByEquality(groupByDescription.name, data, format);
    } else {
        throw new Error(`Unsupported group by type: ${groupByDescription.groupBy.type}`);
    }
}

export function applyGroupByValue<D>(groupByValue: GroupByValue<D, keyof D>, data: D[], formats: Formats<D>): Groups<D> {
    if (groupByValue.type === 'identity') {
        return data.map((row) => ({ data: [row], label: '' }));
    } else {
        return applyGroupByDescription(groupByValue, data, formats);
    }
}
