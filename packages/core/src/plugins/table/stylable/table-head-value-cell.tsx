import * as React from 'react';
import { TableDescription, ColumnDescriptor, ValueHeaderRow } from '../../../table/model';

export interface TableHeadValueCellProps<D> {
    scope: 'row' | 'col';
    colStart: number;
    id: string;
    row: ValueHeaderRow<D>;
    column: ColumnDescriptor<D>;
    tableDescription: TableDescription<D>;
    style?: React.CSSProperties;
}

export class TableHeadValueCell<D> extends React.Component<TableHeadValueCellProps<D>, never> {
    render() {
        const { colStart, tableDescription, row, column, ...other } = this.props;
        return <th {...other} />;
    }
}
