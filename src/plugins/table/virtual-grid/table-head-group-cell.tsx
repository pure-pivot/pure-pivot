import * as React from 'react';
import { TableHeadGroupCellProps } from '../../../table/table-head-group-cell';

export class TableHeadGroupCell<D> extends React.Component<TableHeadGroupCellProps<D>, never> {
    render() {
        const { colStart, tableDescription, id, row, column, scope, colSpan, ...other } = this.props;
        return <div style={{ gridColumnStart: `span ${colSpan}` }} {...other} />;
    }
}
