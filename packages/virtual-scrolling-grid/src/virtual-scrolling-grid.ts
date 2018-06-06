import * as React from 'react';
import { TableConfigurationBuilder } from '@pure-pivot/default-table/lib/es6/configuration';
import { TableHeadGroupCell } from './table-head-group-cell';
import { TableHeadValueCell } from './table-head-value-cell';
import { provideProps } from '@pure-pivot/core/lib/es6/util/provide-props';
import { TableContainer, TableContainerProps, TableContainerProvidedProps } from './table-container';
import { TableBodyCell } from './table-body-cell';
import { TableBodyRows, TableBodyRowsProps } from './table-body-rows';

// TODO: keep all existing functionality of builder, or drop it and make one monolithic component for now, and then perhaps custom .with calls in future

export interface VirtualScrollingTableConfiguration<D> {
    tableContainerComponent: React.ComponentClass<Pick<TableContainerProps<D>, Exclude<keyof TableContainerProps<D>, TableContainerProvidedProps>>>;
}

export interface VirtualScrollingTableConfigurationBuilder<D> extends Pick<TableConfigurationBuilder<D>, Exclude<keyof TableConfigurationBuilder<D>, 'tableContainerComponent' | 'tableBodyRowsComponent' | 'withTableContainerComponent' | 'withTableHeadComponent' | 'withTableBodyComponent' | 'withTableBodyRowsComponent' | 'build'>> {
    tableContainerComponent: React.ComponentClass<TableContainerProps<D>>;
    tableBodyRowsComponent: React.ComponentType<TableBodyRowsProps<D>>;
    withTableContainerComponent<C>(this: C, tableContainerComponent: React.ComponentType<TableContainerProps<D>>): C;
    withTableBodyRowsComponent<C>(this: C, tableBodyRowsComponent: React.ComponentType<TableBodyRowsProps<D>>): C;
    build(): VirtualScrollingTableConfiguration<D>;
}

export const virtualGrid = <D>() => (tableConfigurationBuilder: TableConfigurationBuilder<D>): VirtualScrollingTableConfigurationBuilder<D> => {
    const { withTableHeadComponent, withTableBodyComponent, ...other } = tableConfigurationBuilder;

    tableConfigurationBuilder.withTableHeadRowComponent(React.Fragment);
    tableConfigurationBuilder.withTableHeadGroupCellComponent(TableHeadGroupCell);
    tableConfigurationBuilder.withTableHeadValueCellComponent(TableHeadValueCell);
    tableConfigurationBuilder.withTableBodyRowComponent(React.Fragment);
    tableConfigurationBuilder.withTableBodyCellComponent(TableBodyCell);

    const builder: VirtualScrollingTableConfigurationBuilder<D> = {
        ...other,
        tableContainerComponent: TableContainer,
        tableBodyRowsComponent: TableBodyRows,
        withTableContainerComponent(tableContainerComponent: React.ComponentClass<TableContainerProps<D>>) {
            builder.tableContainerComponent = tableContainerComponent;
            return this;
        },
        withTableBodyRowsComponent(tableBodyRowsComponent: React.ComponentType<TableBodyRowsProps<D>>) {
            builder.tableBodyRowsComponent = tableBodyRowsComponent;
            return this;
        },
        build() {
            return {
                tableContainerComponent: provideProps(builder.tableContainerComponent, {
                    tableHeadRowsComponent: provideProps(tableConfigurationBuilder.tableHeadRowsComponent, {
                        tableHeadGroupRowComponent: provideProps(tableConfigurationBuilder.tableHeadGroupRowComponent, {
                            tableHeadRowComponent: tableConfigurationBuilder.tableHeadRowComponent,
                            tableHeadGroupCellComponent: tableConfigurationBuilder.tableHeadGroupCellComponent
                        }),
                        tableHeadValueRowComponent: provideProps(tableConfigurationBuilder.tableHeadValueRowComponent, {
                            tableHeadRowComponent: tableConfigurationBuilder.tableHeadRowComponent,
                            tableHeadValueCellComponent: tableConfigurationBuilder.tableHeadValueCellComponent
                        })
                    }),
                    tableBodyRowsComponent: provideProps(builder.tableBodyRowsComponent, {
                        tableBodyRowComponent: tableConfigurationBuilder.tableBodyRowComponent,
                        tableBodyCellComponent: tableConfigurationBuilder.tableBodyCellComponent
                    })
                })
            };
        }
    };

    return builder;
};
