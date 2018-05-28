import * as React from 'react';
import { TableDescription, ColumnDescriptor } from './model';

export interface TableHeadValueCellProps<D> {
    scope: 'row' | 'col';
    colStart: number;
    colSpan: number;
    column: ColumnDescriptor;
    tableDescription: TableDescription<D>;
}

export class TableHeadValueCell<D> extends React.Component<TableHeadValueCellProps<D>, never> {
    render() {
        const { colStart, tableDescription, ...other } = this.props;
        return <th {...other} />;
    }
}
