import * as React from 'react';
import { TableHeadValueCellProps } from './table-head-value-cell';
import { ValueHeaderRow, TableDescription, HeadColumnDescriptor } from './model';
import { getHeadValueRowCellId } from '@pure-pivot/core/lib/es6/util/id-helper';

export interface TableHeadValueRowProps<D> {
    row: ValueHeaderRow<D>;
    tableDescription: TableDescription<D>;
    tableHeadRowComponent: React.ReactType;
    tableHeadValueCellComponent: React.ComponentType<TableHeadValueCellProps<D>>;
}

export type TableHeadValueRowProvidedProps = 'tableHeadRowComponent' | 'tableHeadValueCellComponent';

export class TableHeadValueRow<D> extends React.Component<TableHeadValueRowProps<D>, never> {
    render() {
        const headColumn: HeadColumnDescriptor = { type: 'head-column' };

        return <this.props.tableHeadRowComponent>
            <this.props.tableHeadValueCellComponent
                id={getHeadValueRowCellId(headColumn)}
                scope="row"
                colStart={0}
                row={this.props.row}
                column={headColumn}
                tableDescription={this.props.tableDescription}
            >
                Values
            </this.props.tableHeadValueCellComponent>
            {this.props.row.columns.map((column, index) => {
                const id = getHeadValueRowCellId(column);
                return <this.props.tableHeadValueCellComponent
                    key={id}
                    id={id}
                    scope="col"
                    colStart={1 + index}
                    row={this.props.row}
                    column={column}
                    tableDescription={this.props.tableDescription}
                >
                    {column.valueDescription.label}
                </this.props.tableHeadValueCellComponent>;
            })}
        </this.props.tableHeadRowComponent>;
    }
}
