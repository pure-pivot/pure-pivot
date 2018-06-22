import * as React from 'react';
import { TableDescription, ValueHeaderRow, ValueColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';

export interface TableHeadValueCellProps<D> {
    scope: 'row' | 'col';
    colStart: number;
    id: string;
    row: ValueHeaderRow<D>;
    column: ValueColumnDescriptor<D>;
    tableDescription: TableDescription<D>;
}

export class TableHeadValueCell<D> extends React.Component<TableHeadValueCellProps<D>, never> {
    render() {
        const { colStart, tableDescription, id, row, column, ...other } = this.props;
        return <th {...other} />;
    }
}
