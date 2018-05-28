import * as React from 'react';
import { TableDescription } from './model';

export interface TableHeadGroupCellProps<D> {
    scope: 'row' | 'col';
    colStart: number;
    colSpan: number;
    tableDescription: TableDescription<D>;
}

export class TableHeadGroupCell<D> extends React.Component<TableHeadGroupCellProps<D>, never> {
    render() {
        const { colStart, tableDescription, ...other } = this.props;
        return <th {...other} />;
    }
}
