import * as React from 'react';
import { ColumnDescriptor, BodyRow } from './model';

export interface TableBodyCellProps<D> {
    id: string;
    row: BodyRow<D>;
    column: ColumnDescriptor<D>;
}

export class TableBodyCell<D> extends React.Component<TableBodyCellProps<D>, never> {
    render() {
        if (this.props.column.type === 'head-column') {
            return <th scope="row">
                {'+'.repeat(this.props.row.level)} {this.props.children}
            </th>;
        } else {
            return <td>{this.props.children}</td>;
        }
    }
}
