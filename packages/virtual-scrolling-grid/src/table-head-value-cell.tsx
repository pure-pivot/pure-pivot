import * as React from 'react';
import { TableHeadValueCellProps } from '@pure-pivot/core/lib/es6/table/table-head-value-cell';

export class TableHeadValueCell<D> extends React.Component<TableHeadValueCellProps<D>, never> {
    render() {
        const { colStart, tableDescription, id, row, column, scope, ...other } = this.props;
        return <div {...other} />;
    }
}
