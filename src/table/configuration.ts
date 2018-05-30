import * as React from 'react';
import { provideProps } from '../util/provide-props';
import { TableContainer, TableContainerProps } from './table-container';
import { TableBody, TableBodyProps } from './table-body';
import { TableHead, TableHeadProps } from './table-head';
import { TableHeadGroupRowProps, TableHeadGroupRow } from './table-head-group-row';
import { TableHeadValueRowProps, TableHeadValueRow } from './table-head-value-row';
import { TableBodyRowsProps, TableBodyRows } from './table-body-rows';
import { TableHeadGroupCell, TableHeadGroupCellProps } from './table-head-group-cell';
import { TableHeadValueCell, TableHeadValueCellProps } from './table-head-value-cell';
import { TableBodyCellProps, TableBodyCell } from './table-body-cell';
import { TableProps, TableProvidedProps, Table } from './table';
import { TableHeadRowsProps, TableHeadRows } from './table-head-rows';

export interface TableConfiguration<D> {
    tableComponent: React.ComponentType<Pick<TableProps<D>, Exclude<keyof TableProps<D>, TableProvidedProps>>>;
}

export interface TableConfigurationBuilder<D> {
    tableComponent: React.ComponentType<TableProps<D>>;
    tableContainerComponent: React.ComponentType<TableContainerProps<D>>;
    tableHeadComponent: React.ComponentType<TableHeadProps<D>>;
    tableHeadRowsComponent: React.ComponentType<TableHeadRowsProps<D>>;
    tableHeadGroupRowComponent: React.ComponentType<TableHeadGroupRowProps<D>>;
    tableHeadValueRowComponent: React.ComponentType<TableHeadValueRowProps<D>>;
    tableHeadGroupCellComponent: React.ComponentType<TableHeadGroupCellProps<D>>;
    tableHeadValueCellComponent: React.ComponentType<TableHeadValueCellProps<D>>;
    tableHeadRowComponent: React.ReactType;
    tableBodyComponent: React.ComponentType<TableBodyProps<D>>;
    tableBodyRowsComponent: React.ComponentType<TableBodyRowsProps<D>>;
    tableBodyRowComponent: React.ReactType;
    tableBodyCellComponent: React.ComponentType<TableBodyCellProps<D>>;
    withTableContainerComponent<C>(this: C, tableContainerComponent: React.ComponentType<TableContainerProps<D>>): C;
    withTableHeadRowComponent<C>(this: C, tableHeadRowComponent: React.ReactType): C;
    withTableHeadGroupCellComponent<C>(this: C, tableHeadGroupCellComponent: React.ComponentType<TableHeadGroupCellProps<D>>): C;
    withTableHeadValueCellComponent<C>(this: C, tableHeadValueCellComponent: React.ComponentType<TableHeadValueCellProps<D>>): C;
    withTableBodyComponent<C>(this: C, tableBodyComponent: React.ComponentType<TableBodyProps<D>>): C;
    withTableBodyRowComponent<C>(this: C, tableBodyRowComponent: React.ReactType): C;
    withTableBodyCellComponent<C>(this: C, tableBodyFirstCellComponent: React.ComponentType<TableBodyCellProps<D>>): C;
    withPlugin<C>(plugin: (tableConfigurationBuilder: this) => C): C;
    build(): TableConfiguration<D>;
}

export function createTableConfigurationBuilder<D>(data: D[], plugins: ((tableConfigurationBuilder: TableConfigurationBuilder<D>) => TableConfigurationBuilder<D>)[] = []): TableConfigurationBuilder<D> {
    const builder: TableConfigurationBuilder<D> = {
        tableComponent: Table,
        tableContainerComponent: TableContainer,
        tableHeadComponent: TableHead,
        tableHeadRowsComponent: TableHeadRows,
        tableHeadGroupRowComponent: TableHeadGroupRow,
        tableHeadValueRowComponent: TableHeadValueRow,
        tableHeadGroupCellComponent: TableHeadGroupCell,
        tableHeadValueCellComponent: TableHeadValueCell,
        tableHeadRowComponent: 'tr',
        tableBodyComponent: TableBody,
        tableBodyRowsComponent: TableBodyRows,
        tableBodyRowComponent: 'tr',
        tableBodyCellComponent: TableBodyCell,
        withTableContainerComponent(tableContainerComponent: React.ComponentType<TableContainerProps<D>>) {
            builder.tableContainerComponent = tableContainerComponent;
            return this;
        },
        withTableHeadRowComponent(tableHeadRowComponent: React.ReactType) {
            builder.tableHeadRowComponent = tableHeadRowComponent;
            return this;
        },
        withTableHeadGroupCellComponent(tableHeadGroupCellComponent: React.ComponentType<TableHeadGroupCellProps<D>>) {
            builder.tableHeadGroupCellComponent = tableHeadGroupCellComponent;
            return this;
        },
        withTableHeadValueCellComponent(tableHeadValueCellComponent: React.ComponentType<TableHeadValueCellProps<D>>) {
            builder.tableHeadValueCellComponent = tableHeadValueCellComponent;
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
        withTableBodyCellComponent(tableBodyCellComponent: React.ComponentType<TableBodyCellProps<D>>) {
            builder.tableBodyCellComponent = tableBodyCellComponent;
            return this;
        },
        withPlugin<C>(plugin: (tableConfigurationBuilder: TableConfigurationBuilder<D>) => C) {
            return plugin(this);
        },
        build() {
            return {
                tableComponent: provideProps(builder.tableComponent, {
                    tableContainerComponent: provideProps(builder.tableContainerComponent, {
                        tableHeadComponent: provideProps(builder.tableHeadComponent, {
                            tableHeadRowsComponent: provideProps(builder.tableHeadRowsComponent, {
                                tableHeadGroupRowComponent: provideProps(builder.tableHeadGroupRowComponent, {
                                    tableHeadRowComponent: builder.tableHeadRowComponent,
                                    tableHeadGroupCellComponent: builder.tableHeadGroupCellComponent
                                }),
                                tableHeadValueRowComponent: provideProps(builder.tableHeadValueRowComponent, {
                                    tableHeadRowComponent: builder.tableHeadRowComponent,
                                    tableHeadValueCellComponent: builder.tableHeadValueCellComponent
                                })
                            })
                        }),
                        tableBodyComponent: provideProps(builder.tableBodyComponent, {
                            tableBodyRowsComponent: provideProps(builder.tableBodyRowsComponent, {
                                tableBodyRowComponent: builder.tableBodyRowComponent,
                                tableBodyCellComponent: builder.tableBodyCellComponent
                            })
                        })
                    })
                })
            };
        }
    };

    return plugins.reduce((builder, plugin) => plugin(builder), builder);
}
