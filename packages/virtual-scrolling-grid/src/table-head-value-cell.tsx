import * as React from 'react';
import { TableHeadValueCellProps } from '@pure-pivot/default-table/lib/es6/table-head-value-cell';

export class TableHeadValueCell<D> extends React.Component<TableHeadValueCellProps<D>, never> {
    render() {
        const { colStart, tableDescription, id, row, column, scope, ...other } = this.props;
        return <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }} {...other} />;
    }
}
