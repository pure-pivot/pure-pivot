import * as React from 'react';
import { TableBodyProps } from '../../../table/table-body';

export class TableBody<D> extends React.Component<TableBodyProps<D>, never> {
    render() {
        return <this.props.tableBodyRowsComponent tableDescription={this.props.tableDescription} />;
    }
}
