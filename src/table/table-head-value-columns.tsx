import * as React from 'react';
import { Grouping } from '../groups/apply-grouping';
import { Groups } from '../groups/model';
import { ValueReducers } from '../values/model';
import { TableHeadCellProps } from './table-head-cell';

export interface ValueHeaderRow {
    type: 'value-header-row';
    labels: string[];
}

export interface TableHeadValueColumnsProps<D> {
    row: ValueHeaderRow;
    tableHeadRowComponent: React.ReactType;
    tableHeadCellComponent: React.ComponentType<TableHeadCellProps>;
}

export type TableHeadValueColumnsProvidedProps = 'tableHeadRowComponent' | 'tableHeadCellComponent';

export class TableHeadValueColumns<D> extends React.Component<TableHeadValueColumnsProps<D>, never> {
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
