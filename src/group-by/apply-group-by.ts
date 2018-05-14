import { GroupByDescription, isGroupByBooleanEquality, isGroupByNumberEquality, isGroupByNumberCount, isGroupByNumberRange, isGroupByStringEquality, isGroupByOtherEquality, GroupByNumberCount, GroupByNumberRange, GroupByValue } from './model';
import { partitionData } from '../util/partition';
import { assertOrThrow, isNumber } from '../util/assertion';

export type Group<D> = D[];

export type Groups<D> = Group<D>[];

export function applyGroupByEquality<D>(name: keyof D, data: D[]): Groups<D> {
    return partitionData(data, (d1, d2) => d1[name] === d2[name]);
}

export function applyGroupByNumberCount<D>(name: keyof D, data: D[], groupBy: GroupByNumberCount): Groups<D> {
    if (groupBy.count >= 1) {
        const min = data.reduce((min, row) => Math.min(min, assertOrThrow(row[name], isNumber)), Number.POSITIVE_INFINITY);
        const max = data.reduce((max, row) => Math.max(max, assertOrThrow(row[name], isNumber)), Number.NEGATIVE_INFINITY);
        const range = max - min;

        if (range > 0) {
            const groups: Groups<D> = [];
            for (let i = 0; i < groupBy.count; i++) {
                groups.push([]);
            }

            for (const row of data) {
                const groupIndex = Math.floor((assertOrThrow(row[name], isNumber) - min) / range * groupBy.count);
                if (groupIndex === groupBy.count) {
                    groups[groupBy.count - 1].push(row);
                } else {
                    groups[groupIndex].push(row);
                }
            }

            return groups;
        } else {
            return [data];
        }
    } else {
        return [];
    }
}

export function applyGroupByNumberRange<D>(name: keyof D, data: D[], groupBy: GroupByNumberRange): Groups<D> {
    const min = data.reduce((min, row) => Math.min(min, assertOrThrow(row[name], isNumber)), Number.POSITIVE_INFINITY);
    const max = data.reduce((max, row) => Math.max(max, assertOrThrow(row[name], isNumber)), Number.NEGATIVE_INFINITY);
    const range = max - min;

    if (groupBy.range > 0) {
        if (range > 0) {
            const groups: Groups<D> = [];
            for (let i = min; i < max; i += groupBy.range) {
                groups.push([]);
            }
            for (const row of data) {
                const groupIndex = Math.floor((assertOrThrow(row[name], isNumber) - min) / groupBy.range);
                if (groupIndex === groups.length) {
                    groups[groups.length - 1].push(row);
                } else {
                    groups[groupIndex].push(row);
                }
            }

            return groups;
        } else {
            return [data];
        }
    } else {
        return [];
    }
}

export function applyGroupByDescription<D>(groupByDescription: GroupByDescription<D, keyof D>, data: D[]): Groups<D> {
    if (isGroupByBooleanEquality(groupByDescription.groupBy)) {
        return applyGroupByEquality(groupByDescription.name, data);
    } else if (isGroupByNumberEquality(groupByDescription.groupBy)) {
        return applyGroupByEquality(groupByDescription.name, data);
    } else if (isGroupByNumberCount(groupByDescription.groupBy)) {
        return applyGroupByNumberCount(groupByDescription.name, data, groupByDescription.groupBy);
    } else if (isGroupByNumberRange(groupByDescription.groupBy)) {
        return applyGroupByNumberRange(groupByDescription.name, data, groupByDescription.groupBy);
    } else if (isGroupByStringEquality(groupByDescription.groupBy)) {
        return applyGroupByEquality(groupByDescription.name, data);
    } else if (isGroupByOtherEquality(groupByDescription.groupBy)) {
        return applyGroupByEquality(groupByDescription.name, data);
    } else {
        throw new Error(`Unsupported group by type: ${groupByDescription.groupBy.type}`);
    }
}

export function applyGroupByValue<D>(groupByValue: GroupByValue<D, keyof D>, data: D[]): Groups<D> {
    if (groupByValue.type === 'identity') {
        return data.map((row) => [row]);
    } else {
        return applyGroupByDescription(groupByValue, data);
    }
}
