import { ValueReducerDescription } from '@pure-pivot/core/lib/es6/values/model';
import { ConfigurationBuilder } from '@pure-pivot/core/lib/es6/configuration';
import { GroupDescriptor } from '@pure-pivot/core/lib/es6/table/model';

export type DataComparator<T> = (value1: T, value2: T) => number;

export interface SortedValueReducerDescription<D, T> extends ValueReducerDescription<D, T> {
    comparator: DataComparator<T>;
}

export type SortedValueReducers<D> = SortedValueReducerDescription<D, {}>[];

export interface SortingDescriptor {
    valueId: string;
    groupDescriptors: GroupDescriptor[];
    order: 'ascending' | 'descending' | null;
}

export interface ImprovedConfigurationBuilder<D> extends Pick<ConfigurationBuilder<D>, Exclude<keyof ConfigurationBuilder<D>, 'values' | 'withValue' | 'withValues'>> {
    values: SortedValueReducers<D>;
    autoSorters: SortingDescriptor[];
    withAutoSorter<C>(this: C, sorter: SortingDescriptor): C;
    withAutoSorters<C>(this: C, sorters: SortingDescriptor[]): C;
    withValues<C>(this: C, values: SortedValueReducers<D>): C;
    withValue<C, T>(this: C, value: SortedValueReducerDescription<D, T>): C;
}
