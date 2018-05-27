import * as React from 'react';
import { provideProps } from '../util/provide-props';
import { TableContainer, TableContainerProps } from './table-container';
import { TableBody, TableBodyProps } from './table-body';
import { TableHead, TableHeadProps } from './table-head';
import { TableHeadGroupRowProps, TableHeadGroupRow } from './table-head-group-row';
import { TableHeadValueRowProps, TableHeadValueRow } from './table-head-value-row';
import { TableBodyRowsProps, TableBodyRows } from './table-body-rows';
import { TableHeadCell, TableHeadCellProps } from './table-head-cell';
import { TableBodyFirstCellProps, TableBodyFirstCell } from './table-body-first-cell';
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
    tableHeadGroupRowsComponent: React.ComponentType<TableHeadGroupRowProps<D>>;
    tableHeadValueRowsComponent: React.ComponentType<TableHeadValueRowProps<D>>;
    tableHeadCellComponent: React.ComponentType<TableHeadCellProps>;
    tableHeadRowComponent: React.ReactType;
    tableBodyComponent: React.ComponentType<TableBodyProps<D>>;
    tableBodyRowsComponent: React.ComponentType<TableBodyRowsProps<D>>;
    tableBodyRowComponent: React.ReactType;
    tableBodyFirstCellComponent: React.ComponentType<TableBodyFirstCellProps>;
    tableBodyCellComponent: React.ReactType;
    withTableContainerComponent(tableContainerComponent: React.ComponentType<TableContainerProps<D>>): this;
    withTableHeadRowsComponent(tableHeadRowsComponent: React.ComponentType<TableHeadRowsProps<D>>): this;
    withTableHeadRowComponent(tableHeadRowComponent: React.ReactType): this;
    withTableHeadCellComponent(tableHeadCellComponent: React.ComponentType<TableHeadCellProps>): this;
    withTableBodyComponent(tableBodyComponent: React.ComponentType<TableBodyProps<D>>): this;
    withTableBodyRowComponent(tableBodyRowComponent: React.ReactType): this;
    withTableBodyFirstCellComponent(tableBodyFirstCellComponent: React.ComponentType<TableBodyFirstCellProps>): this;
    withTableBodyCellComponent(tableBodyCellComponent: React.ReactType): this;
    build(): TableConfiguration<D>;
}

export function createTableConfigurationBuilder<D>(data: D[]): TableConfigurationBuilder<D> {
    const builder: TableConfigurationBuilder<D> = {
        tableComponent: Table,
        tableContainerComponent: TableContainer,
        tableHeadComponent: TableHead,
        tableHeadRowsComponent: TableHeadRows,
        tableHeadGroupRowsComponent: TableHeadGroupRow,
        tableHeadValueRowsComponent: TableHeadValueRow,
        tableHeadCellComponent: TableHeadCell,
        tableHeadRowComponent: 'tr',
        tableBodyComponent: TableBody,
        tableBodyRowsComponent: TableBodyRows,
        tableBodyRowComponent: 'tr',
        tableBodyFirstCellComponent: TableBodyFirstCell,
        tableBodyCellComponent: 'td',
        withTableContainerComponent(tableContainerComponent: React.ComponentType<TableContainerProps<D>>) {
            builder.tableContainerComponent = tableContainerComponent;
            return this;
        },
        withTableHeadRowsComponent(tableHeadRowsComponent: React.ComponentType<TableHeadRowsProps<D>>) {
            builder.tableHeadRowsComponent = tableHeadRowsComponent;
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
                tableComponent: provideProps(builder.tableComponent, {
                    tableContainerComponent: provideProps(builder.tableContainerComponent, {
                        tableHeadComponent: provideProps(builder.tableHeadComponent, {
                            tableHeadRowsComponent: provideProps(builder.tableHeadRowsComponent, {
                                tableHeadGroupRowsComponent: provideProps(builder.tableHeadGroupRowsComponent, {
                                    tableHeadRowComponent: builder.tableHeadRowComponent,
                                    tableHeadCellComponent: builder.tableHeadCellComponent
                                }),
                                tableHeadValueRowsComponent: provideProps(builder.tableHeadValueRowsComponent, {
                                    tableHeadRowComponent: builder.tableHeadRowComponent,
                                    tableHeadCellComponent: builder.tableHeadCellComponent
                                })
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

    return builder;
}
