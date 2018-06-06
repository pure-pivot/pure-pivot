import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableContainerProps } from '../../../table/table-container';

export class TableContainer<D> extends React.Component<TableContainerProps<D>, never> {
    shouldComponentUpdate(nextProps: TableContainerProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${this.props.tableDescription.columnCount}, auto)` }}>
            <this.props.tableHeadComponent tableDescription={this.props.tableDescription} />
            <this.props.tableBodyComponent tableDescription={this.props.tableDescription} />
        </div>;
    }
}
