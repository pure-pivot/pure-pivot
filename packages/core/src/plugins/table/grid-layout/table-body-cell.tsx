import * as React from 'react';
import { TableBodyCellProps } from '../../../table/table-body-cell';

export class TableBodyCell<D> extends React.Component<TableBodyCellProps<D>, never> {
    render() {
        return <div>
            {this.props.column.type === 'head-column' ? '+'.repeat(this.props.row.level) : null} {this.props.children}
        </div>;
    }
}
