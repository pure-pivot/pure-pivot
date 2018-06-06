import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyCellProps } from '@pure-pivot/core/lib/es6/table/table-body-cell';
import { BodyRow, ColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';

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
        // min-width: 0 needed by Firefox https://stackoverflow.com/questions/43311943/prevent-content-from-expanding-grid-items
        return <div style={{ /*height: this.state.rowHeight,*/ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 /*, boxSizing: 'border-box'*/ }}>
            {this.props.column.type === 'head-column' ? '+'.repeat(this.props.row.level) : null} {this.props.children}
        </div>;
    }
}
