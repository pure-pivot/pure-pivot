import * as React from 'react';
import { TableContainerProps } from '../../../table/table-container';

export class TableContainer<D> extends React.Component<TableContainerProps<D>, never> {
    render() {
        return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${this.props.tableDescription.columnCount}, auto)` }}>
            <this.props.tableHeadComponent tableDescription={this.props.tableDescription} />
            <this.props.tableBodyComponent tableDescription={this.props.tableDescription} />
        </div>;
    }
}
