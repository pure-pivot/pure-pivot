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
    withFilters<C>(this: C, filters: Filters<D>): C;
    withFilter<C>(this: C, filter: Filter<D>): C;
    withValues<C>(this: C, values: ValueReducers<D>): C;
    withValue<C>(this: C, value: ValueReducerDescription<D>): C;
    withGroups<C>(this: C, groups: Groups<D>): C;
    withGroup<C>(this: C, group: Grouper<D>): C;
    withSelections<C>(this: C, selections: Selections<D>): C;
    withSelection<C>(this: C, selection: Grouper<D>): C;
    withSorters<C>(this: C, sorters: Comparators<D>): C;
    withSorter<C>(this: C, sorter: Comparator<D>): C;
    withTableConfiguration<C>(this: C, tableConfiguration: TableConfiguration<D>): C;
    withPlugin<C>(plugin: (configurationBuilder: ConfigurationBuilder<D>) => C): C;
    build(): Configuration<D>;
}

export function createConfigurationBuilder<D>(data: D[], plugins: ((configurationBuilder: ConfigurationBuilder<D>) => ConfigurationBuilder<D>)[] = defaultPlugins): ConfigurationBuilder<D> {
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
        withPlugin<C>(plugin: (configurationBuilder: ConfigurationBuilder<D>) => C) {
            return plugin(this);
        },
        build() {
            return {
                data,
                filters: this.filters,
                groups: this.groups,
                selections: this.selections,
                sorting: this.sorting,
                values: this.values,
                tableComponent: this.tableConfiguration.tableComponent
            };
        }
    };

    return plugins.reduce((builder, plugin) => plugin(builder), builder);
}
