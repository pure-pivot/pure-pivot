import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyCellProps } from '../../../table/table-body-cell';
import { BodyRow, ColumnDescriptor } from '../../../table/model';

export interface TableBodyCellProps<D> {
    id: string;
    row: BodyRow<D>;
    column: ColumnDescriptor<D>;
}

export class TableBodyCell<D> extends React.Component<TableBodyCellProps<D>, never> {
    shouldComponentUpdate(nextProps: TableBodyCellProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return <div style={{ /*height: this.state.rowHeight,*/ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxSizing: 'border-box' }}>
            {this.props.column.type === 'head-column' ? '+'.repeat(this.props.row.level) : null} {this.props.children}
        </div>;
    }
}
