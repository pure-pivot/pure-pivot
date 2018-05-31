import * as React from 'react';
import { TableConfigurationBuilder, TableConfiguration } from '../../../table/configuration';
import { TableBodyCell } from './table-body-cell';
import { TableHead } from './table-head';
import { TableBody } from './table-body';
import { TableHeadGroupCell } from './table-head-group-cell';
import { TableHeadValueCell } from './table-head-value-cell';
import { TableContainer } from './table-container';
import { TableBodyRows, PaginatedTableBodyRowsProps } from './table-body-rows';
import { provideProps } from '../../../util/provide-props';
import { PaginationProps, Pagination } from './pagination';

export interface GridLayoutTableConfiguration<D> extends TableConfiguration<D> {
    paginationComponent: React.ComponentType<PaginationProps>;
}

export interface GridLayoutTableConfigurationBuilder<D> {
    paginationComponent: React.ComponentType<PaginationProps>;
    withPaginationComponent<C>(this: C, paginationComponent: React.ComponentType<PaginationProps>): C;
    build(): GridLayoutTableConfiguration<D>;
}

export const gridLayout = <D>() => <C extends TableConfigurationBuilder<D>>(tableConfigurationBuilder: C): Pick<C, Exclude<keyof C, keyof GridLayoutTableConfigurationBuilder<D>>> & GridLayoutTableConfigurationBuilder<D> => {
    tableConfigurationBuilder.withTableBodyCellComponent(TableBodyCell);
    tableConfigurationBuilder.withTableBodyRowComponent(React.Fragment);
    tableConfigurationBuilder.withTableHeadRowComponent(React.Fragment);
    tableConfigurationBuilder.withTableHeadComponent(TableHead);
    tableConfigurationBuilder.withTableBodyComponent(TableBody);
    tableConfigurationBuilder.withTableBodyRowsComponent(provideProps(TableBodyRows as React.ComponentType<PaginatedTableBodyRowsProps<D>>, {
        offset: 0,
        limit: 50
    }));
    tableConfigurationBuilder.withTableHeadGroupCellComponent(TableHeadGroupCell);
    tableConfigurationBuilder.withTableHeadValueCellComponent(TableHeadValueCell);
    tableConfigurationBuilder.withTableContainerComponent(TableContainer);

    const builder: Pick<C, Exclude<keyof C, keyof GridLayoutTableConfigurationBuilder<D>>> & GridLayoutTableConfigurationBuilder<D> = Object.assign({}, tableConfigurationBuilder, {
        paginationComponent: Pagination,
        withPaginationComponent<C>(this: C, paginationComponent: React.ComponentType<PaginationProps>) {
            builder.paginationComponent = paginationComponent;
            return this;
        },
        build() {
            return Object.assign({}, tableConfigurationBuilder.build(), {
                paginationComponent: Pagination
            });
        }
    });

    return builder;
};
