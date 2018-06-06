import * as React from 'react';
import { TableHeadProps } from '../../../table/table-head';

export class TableHead<D> extends React.Component<TableHeadProps<D>, never> {
    render() {
        return <this.props.tableHeadRowsComponent tableDescription={this.props.tableDescription} />;
    }
}
