import { ValueReducerDescription } from '@pure-pivot/core/lib/es6/values/model';
import { ConfigurationBuilder } from '@pure-pivot/core/lib/es6/configuration';
import { GroupDescriptor } from '@pure-pivot/core/lib/es6/table/model';

export type DataComparator<D> = (data1: D[], data2: D[]) => number;

export interface SortedValueReducerDescription<D> extends ValueReducerDescription<D> {
    comparator: DataComparator<D>;
}

export type SortedValueReducers<D> = SortedValueReducerDescription<D>[];

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
    withValue<C>(this: C, value: SortedValueReducerDescription<D>): C;
}
