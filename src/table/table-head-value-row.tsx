import * as React from 'react';
import { TableHeadValueCellProps } from './table-head-value-cell';
import { ValueHeaderRow, TableDescription } from './model';

export interface TableHeadValueRowProps<D> {
    row: ValueHeaderRow;
    tableDescription: TableDescription<D>;
    tableHeadRowComponent: React.ReactType;
    tableHeadValueCellComponent: React.ComponentType<TableHeadValueCellProps<D>>;
}

export type TableHeadValueRowProvidedProps = 'tableHeadRowComponent' | 'tableHeadValueCellComponent';

export class TableHeadValueRow<D> extends React.Component<TableHeadValueRowProps<D>, never> {
    render() {
        return <this.props.tableHeadRowComponent>
            <this.props.tableHeadValueCellComponent scope="row" colStart={0} colSpan={1} tableDescription={this.props.tableDescription}>
                Values
            </this.props.tableHeadValueCellComponent>
            {this.props.row.labels.map((label, index) =>
                <this.props.tableHeadValueCellComponent key={index} scope="col" colStart={1 + index} colSpan={1} tableDescription={this.props.tableDescription}>
                    {label}
                </this.props.tableHeadValueCellComponent>
            )}
        </this.props.tableHeadRowComponent>;
    }
}
