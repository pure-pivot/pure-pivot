import * as React from 'react';
import { Filters, Filter } from './filters/model';
import { TableProps, TableProvidedProps, Table } from './table/table';
import { ValueReducers, ValueReducerDescription } from './values/model';
import { Groups, Grouper } from './groups/model';
import { Selections } from './selections/model';
import { defaultPlugins } from './plugins/default-plugins';
import { Comparators, Comparator } from './sorting/model';
import { provideProps } from './util/provide-props';
import { TableContainer, TableContainerProps } from './table/table-container';
import { TableBody, TableBodyProps } from './table/table-body';
import { TableHead, TableHeadProps } from './table/table-head';

export interface Configuration<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Comparators<D>;
    values: ValueReducers<D>;
    // filtersComponent: React.ComponentType<Pick<FiltersComponentProps<D>, Exclude<keyof FiltersComponentProps<D>, FiltersComponentProvidedProps>>>;
    tableComponent: React.ComponentType<Pick<TableProps<D>, Exclude<keyof TableProps<D>, TableProvidedProps>>>;
}

export interface ConfigurationBuilder<D> {
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Comparators<D>;
    values: ValueReducers<D>;
    tableComponent: React.ComponentType<TableProps<D>>;
    tableContainerComponent: React.ComponentType<TableContainerProps>;
    tableHeadComponent: React.ComponentType<TableHeadProps>;
    tableBodyComponent: React.ComponentType<TableBodyProps>;
    withFilters(filters: Filters<D>): this;
    withFilter(filter: Filter<D>): this;
    withValues(values: ValueReducers<D>): this;
    withValue(value: ValueReducerDescription<D>): this;
    withGroups(groups: Groups<D>): this;
    withGroup(group: Grouper<D>): this;
    withSelections(selections: Selections<D>): this;
    withSelection(selection: Grouper<D>): this;
    withSorter(sorter: Comparator<D>): this;
    withSorters(sorters: Comparators<D>): this;
    withTableContainerComponent(tableContainerComponent: React.ComponentType<TableContainerProps>): this;
    withTableHeadComponent(tableHeadComponent: React.ComponentType<TableHeadProps>): this;
    withTableBodyComponent(tableBodyComponent: React.ComponentType<TableBodyProps>): this;
    build(): Configuration<D>;
}

export function createConfigurationBuilder<D>(data: D[]): ConfigurationBuilder<D> {
    const builder: ConfigurationBuilder<D> = {
        filters: [],
        groups: [],
        selections: [],
        sorting: [],
        values: [],
        tableComponent: Table,
        tableContainerComponent: TableContainer,
        tableHeadComponent: TableHead,
        tableBodyComponent: TableBody,
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
        withSorter(sorter: Comparator<D>) {
            builder.sorting = [...builder.sorting, sorter];
            return this;
        },
        withSorters(sorters: Comparators<D>) {
            builder.sorting = sorters;
            return this;
        },
        withTableContainerComponent(tableContainerComponent: React.ComponentType<TableContainerProps>) {
            builder.tableContainerComponent = tableContainerComponent;
            return this;
        },
        withTableHeadComponent(tableHeadComponent: React.ComponentType<TableHeadProps>) {
            builder.tableHeadComponent = tableHeadComponent;
            return this;
        },
        withTableBodyComponent(tableBodyComponent: React.ComponentType<TableBodyProps>) {
            builder.tableBodyComponent = tableBodyComponent;
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
                tableComponent: provideProps(builder.tableComponent, {
                    tableContainerComponent: builder.tableContainerComponent,
                    tableHeadComponent: builder.tableHeadComponent,
                    tableBodyComponent: builder.tableBodyComponent
                })
            };
        }
    };

    return defaultPlugins.reduce((builder, plugin) => plugin(builder), builder);
}
