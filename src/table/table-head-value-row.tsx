import * as React from 'react';
import { TableHeadCellProps } from './table-head-cell';
import { ValueHeaderRow, TableDescription } from './model';

export interface TableHeadValueRowProps<D> {
    row: ValueHeaderRow;
    tableDescription: TableDescription<D>;
    tableHeadRowComponent: React.ReactType;
    tableHeadCellComponent: React.ComponentType<TableHeadCellProps>;
}

export type TableHeadValueRowProvidedProps = 'tableHeadRowComponent' | 'tableHeadCellComponent';

export class TableHeadValueRow<D> extends React.Component<TableHeadValueRowProps<D>, never> {
    render() {
        return <this.props.tableHeadRowComponent>
            <this.props.tableHeadCellComponent scope="row" colSpan={1}>
                Values
            </this.props.tableHeadCellComponent>
            {this.props.row.labels.map((label, index) =>
                <this.props.tableHeadCellComponent key={index} scope="col" colSpan={1}>
                    {label}
                </this.props.tableHeadCellComponent>
            )}
        </this.props.tableHeadRowComponent>;
    }
}
