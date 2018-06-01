import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableHeadRowsProps } from '../../../table/table-head-rows';

export class TableHeadRows<D> extends React.Component<TableHeadRowsProps<D>, never> {
    shouldComponentUpdate(nextProps: TableHeadRowsProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return <div style={{ display: 'grid', position: 'absolute', top: 0, width: '100%', gridTemplateColumns: `repeat(${this.props.tableDescription.columnCount}, ${1 / this.props.tableDescription.columnCount * 100}%)` }}>
            {this.props.tableDescription.headRows.map((headRow, index) => {
                if (headRow.type === 'group-header-row') {
                    return <this.props.tableHeadGroupRowComponent key={headRow.groupId} tableDescription={this.props.tableDescription} row={headRow} />;
                } else if (headRow.type === 'value-header-row') {
                    return <this.props.tableHeadValueRowComponent key={`value-row-${index}`} tableDescription={this.props.tableDescription} row={headRow} />;
                } else {
                    // TODO: investigate custom head rows
                    // return <headRow.renderer tableDescription={this.props.tableDescription} />;
                }
            })}
        </div>;
    }
}
