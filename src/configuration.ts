import * as React from 'react';
import { Filters, Filter } from './filters/model';
import { TableProps, TableProvidedProps, Table } from './table/table';
import { ValueReducers, ValueReducerDescription } from './values/model';
import { Groups, Grouper } from './groups/model';
import { Selections } from './selections/model';
import { defaultPlugins } from './plugins/default-plugins';
import { Comparators, Comparator } from './sorting/model';
import { provideProps } from './util/provide-props';
import { TableConfiguration, createTableConfigurationBuilder } from './table/configuration';

export interface Configuration<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Comparators<D>;
    values: ValueReducers<D>;
    tableComponent: React.ComponentType<Pick<TableProps<D>, Exclude<keyof TableProps<D>, TableProvidedProps>>>;
}

export interface ConfigurationBuilder<D> {
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Comparators<D>;
    values: ValueReducers<D>;
    tableConfiguration: TableConfiguration<D>;
    withFilters(filters: Filters<D>): this;
    withFilter(filter: Filter<D>): this;
    withValues(values: ValueReducers<D>): this;
    withValue(value: ValueReducerDescription<D>): this;
    withGroups(groups: Groups<D>): this;
    withGroup(group: Grouper<D>): this;
    withSelections(selections: Selections<D>): this;
    withSelection(selection: Grouper<D>): this;
    withSorters(sorters: Comparators<D>): this;
    withSorter(sorter: Comparator<D>): this;
    withTableConfiguration(tableConfiguration: TableConfiguration<D>): this;
    build(): Configuration<D>;
}

export function createConfigurationBuilder<D>(data: D[]): ConfigurationBuilder<D> {
    const builder: ConfigurationBuilder<D> = {
        filters: [],
        groups: [],
        selections: [],
        sorting: [],
        values: [],
        tableConfiguration: createTableConfigurationBuilder(data).build(),
        withFilter(filter) {
            builder.filters = [...builder.filters, filter];
            return this;
        },
        withFilters(filters) {
            builder.filters = filters;
            return this;
        },
        withValues(values: ValueReducers<D>) {
            builder.values = values;
            return this;
        },
        withValue(value: ValueReducerDescription<D>) {
            builder.values = [...builder.values, value];
            return this;
        },
        withGroups(groups: Groups<D>) {
            builder.groups = groups;
            return this;
        },
        withGroup(group: Grouper<D>) {
            builder.groups = [...builder.groups, group];
            return this;
        },
        withSelections(selections: Selections<D>) {
            builder.selections = selections;
            return this;
        },
        withSelection(selection: Grouper<D>) {
            builder.selections = [...builder.selections, selection];
            return this;
        },
        withSorters(sorters: Comparators<D>) {
            builder.sorting = sorters;
            return this;
        },
        withSorter(sorter: Comparator<D>) {
            builder.sorting = [...builder.sorting, sorter];
            return this;
        },
        withTableConfiguration(tableConfiguration: TableConfiguration<D>) {
            builder.tableConfiguration = tableConfiguration;
            return this;
        },
        build() {
            return {
                data,
                filters: builder.filters,
                groups: builder.groups,
                selections: builder.selections,
                sorting: builder.sorting,
                values: builder.values,
                tableComponent: builder.tableConfiguration.tableComponent
            };
        }
    };

    return defaultPlugins.reduce((builder, plugin) => plugin(builder), builder);
}
