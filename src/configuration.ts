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
import { TableHeadGroupColumnsProps, TableHeadGroupColumns } from './table/table-head-group-columns';
import { TableHeadValueColumnsProps, TableHeadValueColumns } from './table/table-head-value-columns';
import { TableBodyRowsProps, TableBodyRows } from './table/table-body-rows';
import { TableHeadCell, TableHeadCellProps } from './table/table-head-cell';
import { TableBodyFirstCellProps, TableBodyFirstCell } from './table/table-body-first-cell';

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
    tableContainerComponent: React.ComponentType<TableContainerProps<D>>;
    tableHeadComponent: React.ComponentType<TableHeadProps<D>>;
    tableHeadGroupColumnsComponent: React.ComponentType<TableHeadGroupColumnsProps<D>>;
    tableHeadValueColumnsComponent: React.ComponentType<TableHeadValueColumnsProps<D>>;
    tableHeadCellComponent: React.ComponentType<TableHeadCellProps>;
    tableHeadRowComponent: React.ReactType;
    tableBodyComponent: React.ComponentType<TableBodyProps<D>>;
    tableBodyRowsComponent: React.ComponentType<TableBodyRowsProps<D>>;
    tableBodyRowComponent: React.ReactType;
    tableBodyFirstCellComponent: React.ComponentType<TableBodyFirstCellProps>;
    tableBodyCellComponent: React.ReactType;
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
    withTableContainerComponent(tableContainerComponent: React.ComponentType<TableContainerProps<D>>): this;
    withTableHeadComponent(tableHeadComponent: React.ComponentType<TableHeadProps<D>>): this;
    withTableHeadRowComponent(tableHeadRowComponent: React.ReactType): this;
    withTableHeadCellComponent(tableHeadCellComponent: React.ComponentType<TableHeadCellProps>): this;
    withTableBodyComponent(tableBodyComponent: React.ComponentType<TableBodyProps<D>>): this;
    withTableBodyRowComponent(tableBodyRowComponent: React.ReactType): this;
    withTableBodyFirstCellComponent(tableBodyFirstCellComponent: React.ComponentType<TableBodyFirstCellProps>): this;
    withTableBodyCellComponent(tableBodyCellComponent: React.ReactType): this;
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
        tableHeadGroupColumnsComponent: TableHeadGroupColumns,
        tableHeadValueColumnsComponent: TableHeadValueColumns,
        tableHeadCellComponent: TableHeadCell,
        tableHeadRowComponent: 'tr',
        tableBodyComponent: TableBody,
        tableBodyRowsComponent: TableBodyRows,
        tableBodyRowComponent: 'tr',
        tableBodyFirstCellComponent: TableBodyFirstCell,
        tableBodyCellComponent: 'td',
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
        withTableContainerComponent(tableContainerComponent: React.ComponentType<TableContainerProps<D>>) {
            builder.tableContainerComponent = tableContainerComponent;
            return this;
        },
        withTableHeadComponent(tableHeadComponent: React.ComponentType<TableHeadProps<D>>) {
            builder.tableHeadComponent = tableHeadComponent;
            return this;
        },
        withTableHeadRowComponent(tableHeadRowComponent: React.ReactType) {
            builder.tableHeadRowComponent = tableHeadRowComponent;
            return this;
        },
        withTableHeadCellComponent(tableHeadCellComponent: React.ComponentType<TableHeadCellProps>) {
            builder.tableHeadCellComponent = tableHeadCellComponent;
            return this;
        },
        withTableBodyComponent(tableBodyComponent: React.ComponentType<TableBodyProps<D>>) {
            builder.tableBodyComponent = tableBodyComponent;
            return this;
        },
        withTableBodyRowComponent(tableBodyRowComponent: React.ReactType) {
            builder.tableBodyRowComponent = tableBodyRowComponent;
            return this;
        },
        withTableBodyFirstCellComponent(tableBodyFirstCellComponent: React.ComponentType<TableBodyFirstCellProps>) {
            builder.tableBodyFirstCellComponent = tableBodyFirstCellComponent;
            return this;
        },
        withTableBodyCellComponent(tableBodyCellComponent: React.ReactType) {
            builder.tableBodyCellComponent = tableBodyCellComponent;
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
                    tableContainerComponent: provideProps(builder.tableContainerComponent, {
                        tableHeadComponent: provideProps(builder.tableHeadComponent, {
                            tableHeadGroupColumnsComponent: provideProps(builder.tableHeadGroupColumnsComponent, {
                                tableHeadRowComponent: builder.tableHeadRowComponent,
                                tableHeadCellComponent: builder.tableHeadCellComponent
                            }),
                            tableHeadValueColumnsComponent: provideProps(builder.tableHeadValueColumnsComponent, {
                                tableHeadRowComponent: builder.tableHeadRowComponent,
                                tableHeadCellComponent: builder.tableHeadCellComponent
                            })
                        }),
                        tableBodyComponent: provideProps(builder.tableBodyComponent, {
                            tableBodyRowsComponent: provideProps(builder.tableBodyRowsComponent, {
                                tableBodyRowComponent: builder.tableBodyRowComponent,
                                tableBodyFirstCellComponent: builder.tableBodyFirstCellComponent,
                                tableBodyCellComponent: builder.tableBodyCellComponent
                            })
                        })
                    })
                })
            };
        }
    };

    return defaultPlugins.reduce((builder, plugin) => plugin(builder), builder);
}
