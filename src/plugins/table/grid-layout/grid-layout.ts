import * as React from 'react';
import { TableConfigurationBuilder, TableConfiguration } from '../../../table/configuration';
import { TableBodyCell } from './table-body-cell';
import { TableHead } from './table-head';
import { TableBody } from './table-body';
import { TableHeadGroupCell } from './table-head-group-cell';
import { TableHeadValueCell } from './table-head-value-cell';
import { TableContainer } from './table-container';
import { TableBodyRows } from './table-body-rows';
import { provideProps } from '../../../util/provide-props';

export const gridLayout = <C extends TableConfigurationBuilder<any>>(tableConfigurationBuilder: C): C => {
    tableConfigurationBuilder.withTableBodyCellComponent(TableBodyCell);
    tableConfigurationBuilder.withTableBodyRowComponent(React.Fragment);
    tableConfigurationBuilder.withTableHeadRowComponent(React.Fragment);
    tableConfigurationBuilder.withTableHeadComponent(TableHead);
    tableConfigurationBuilder.withTableBodyComponent(TableBody);
    tableConfigurationBuilder.withTableBodyRowsComponent(provideProps(TableBodyRows, {
        offset: 0,
        limit: 50
    }));
    tableConfigurationBuilder.withTableHeadGroupCellComponent(TableHeadGroupCell);
    tableConfigurationBuilder.withTableHeadValueCellComponent(TableHeadValueCell);
    tableConfigurationBuilder.withTableContainerComponent(TableContainer);
    return tableConfigurationBuilder;
};
