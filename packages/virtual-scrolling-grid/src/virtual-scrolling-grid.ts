import * as React from 'react';
import { TableConfigurationBuilder } from '@pure-pivot/default-table/lib/es6/configuration';
import { TableHeadGroupCell } from './table-head-group-cell';
import { TableHeadValueCell } from './table-head-value-cell';
import { provideProps } from '@pure-pivot/core/lib/es6/util/provide-props';
import { TableContainer, TableContainerProps, TableContainerProvidedProps } from './table-container';
import { TableBodyCell } from './table-body-cell';
import { TableBodyRows, TableBodyRowsProps } from './table-body-rows';
import { TableHeadProps, TableHead } from './table-head';
import { TableBodyProps, TableBody } from './table-body';
import { TableWrapper } from './table-wrapper';
import { TableBodyRow } from './table-body-row';

// TODO: keep all existing functionality of builder, or drop it and make one monolithic component for now, and then perhaps custom .with calls in future

export interface VirtualScrollingTableConfiguration<D> {
    tableContainerComponent: React.ComponentClass<Pick<TableContainerProps<D>, Exclude<keyof TableContainerProps<D>, TableContainerProvidedProps>>>;
}

export interface VirtualScrollingTableConfigurationBuilder<D> extends Pick<TableConfigurationBuilder<D>, Exclude<keyof TableConfigurationBuilder<D>, 'tableContainerComponent' | 'tableHeadComponent' | 'tableBodyComponent' | 'tableBodyRowsComponent' | 'withTableContainerComponent' | 'withTableHeadComponent' | 'withTableBodyComponent' | 'withTableBodyRowsComponent' | 'build'>> {
    tableContainerComponent: React.ComponentClass<TableContainerProps<D>>;
    tableWrapperComponent: React.ReactType;
    tableHeadComponent: React.ComponentClass<TableHeadProps<D>>;
    tableBodyComponent: React.ComponentType<TableBodyProps<D>>;
    tableBodyRowsComponent: React.ComponentType<TableBodyRowsProps<D>>;
    withTableContainerComponent<C>(this: C, tableContainerComponent: React.ComponentType<TableContainerProps<D>>): C;
    withTableWrapperComponent<C>(this: C, tableWrapperComponent: React.ReactType): C;
    withTableHeadComponent<C>(this: C, tableHeadComponent: React.ComponentClass<TableHeadProps<D>>): C;
    withTableBodyComponent<C>(this: C, tableBodyComponent: React.ComponentType<TableBodyProps<D>>): C;
    withTableBodyRowsComponent<C>(this: C, tableBodyRowsComponent: React.ComponentType<TableBodyRowsProps<D>>): C;
    build(): VirtualScrollingTableConfiguration<D>;
}

export const virtualGrid = <D>() => (tableConfigurationBuilder: TableConfigurationBuilder<D>): VirtualScrollingTableConfigurationBuilder<D> => {
    const { tableContainerComponent, tableHeadComponent, tableBodyComponent, tableBodyRowsComponent, withTableContainerComponent, withTableHeadComponent, withTableBodyComponent, withTableBodyRowsComponent, build, ...other } = tableConfigurationBuilder;

    tableConfigurationBuilder.withTableHeadRowComponent(React.Fragment);
    tableConfigurationBuilder.withTableHeadGroupCellComponent(TableHeadGroupCell);
    tableConfigurationBuilder.withTableHeadValueCellComponent(TableHeadValueCell);
    tableConfigurationBuilder.withTableBodyRowComponent(TableBodyRow);
    tableConfigurationBuilder.withTableBodyCellComponent(TableBodyCell);

    const builder: VirtualScrollingTableConfigurationBuilder<D> = {
        ...other,
        tableContainerComponent: TableContainer,
        tableWrapperComponent: TableWrapper,
        tableHeadComponent: TableHead,
        tableBodyComponent: TableBody,
        tableBodyRowsComponent: TableBodyRows,
        withTableContainerComponent(tableContainerComponent: React.ComponentClass<TableContainerProps<D>>) {
            builder.tableContainerComponent = tableContainerComponent;
            return this;
        },
        withTableWrapperComponent(tableWrapperComponent: React.ReactType) {
            builder.tableWrapperComponent = tableWrapperComponent;
            return this;
        },
        withTableHeadComponent(tableHeadComponent: React.ComponentClass<TableHeadProps<D>>) {
            builder.tableHeadComponent = tableHeadComponent;
            return this;
        },
        withTableBodyComponent(tableBodyComponent: React.ComponentType<TableBodyProps<D>>) {
            builder.tableBodyComponent = tableBodyComponent;
            return this;
        },
        withTableBodyRowsComponent(tableBodyRowsComponent: React.ComponentType<TableBodyRowsProps<D>>) {
            builder.tableBodyRowsComponent = tableBodyRowsComponent;
            return this;
        },
        build() {
            return {
                tableContainerComponent: provideProps(builder.tableContainerComponent, {
                    tableWrapperComponent: builder.tableWrapperComponent,
                    tableHeadComponent: provideProps(builder.tableHeadComponent, {
                        tableHeadRowsComponent: provideProps(tableConfigurationBuilder.tableHeadRowsComponent, {
                            tableHeadGroupRowComponent: provideProps(tableConfigurationBuilder.tableHeadGroupRowComponent, {
                                tableHeadRowComponent: tableConfigurationBuilder.tableHeadRowComponent,
                                tableHeadGroupCellComponent: tableConfigurationBuilder.tableHeadGroupCellComponent
                            }),
                            tableHeadValueRowComponent: provideProps(tableConfigurationBuilder.tableHeadValueRowComponent, {
                                tableHeadRowComponent: tableConfigurationBuilder.tableHeadRowComponent,
                                tableHeadValueCellComponent: tableConfigurationBuilder.tableHeadValueCellComponent
                            })
                        })
                    }),
                    tableBodyComponent: provideProps(builder.tableBodyComponent, {
                        tableBodyRowsComponent: provideProps(builder.tableBodyRowsComponent, {
                            tableBodyRowComponent: tableConfigurationBuilder.tableBodyRowComponent,
                            tableBodyCellComponent: tableConfigurationBuilder.tableBodyCellComponent
                        })
                    })
                })
            };
        }
    };

    return builder;
};
