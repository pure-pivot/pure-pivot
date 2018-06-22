import * as React from 'react';
import { TableHeadValueCellProps } from './table-head-value-cell';
import { ValueHeaderRow, TableDescription, HeadColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';
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
        return <this.props.tableHeadRowComponent>
            {this.props.tableDescription.columns.filter((column) => column.type === 'head-column').map((column) =>
                <this.props.tableHeadValueCellComponent
                    id={getHeadValueRowCellId(column)}
                    scope="row"
                    colStart={0}
                    row={this.props.row}
                    column={column}
                    tableDescription={this.props.tableDescription}
                >
                    Values
                </this.props.tableHeadValueCellComponent>
            )}
            {this.props.row.dataColumns.map((column, index) => {
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
