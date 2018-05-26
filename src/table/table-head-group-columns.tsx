import * as React from 'react';
import { Grouping } from '../groups/apply-grouping';
import { Groups } from '../groups/model';
import { ValueReducers } from '../values/model';
import { TableHeadCellProps } from './table-head-cell';

export interface GroupHeaderRowGroup {
    label: string;
    subColumnSize: number;
}

export interface GroupHeaderRow {
    type: 'group-header-row';
    level: number;
    label: string;
    groups: GroupHeaderRowGroup[];
}

export interface TableHeadGroupColumnsProps<D> {
    rows: GroupHeaderRow[];
    valueColumnCount: number;
    tableHeadRowComponent: React.ReactType;
    tableHeadCellComponent: React.ComponentType<TableHeadCellProps>;
}

export type TableHeadGroupColumnsProvidedProps = 'tableHeadRowComponent' | 'tableHeadCellComponent';

export class TableHeadGroupColumns<D> extends React.Component<TableHeadGroupColumnsProps<D>, never> {
    render() {
        return this.props.rows.map((row, index) =>
            <this.props.tableHeadRowComponent key={index}>
                <this.props.tableHeadCellComponent scope="row">
                    {row.label}
                </this.props.tableHeadCellComponent>
                {row.groups.map((rowGroup, index) =>
                    <this.props.tableHeadCellComponent key={index} scope="col" colSpan={rowGroup.subColumnSize * this.props.valueColumnCount}>
                        {rowGroup.label}
                    </this.props.tableHeadCellComponent>
                )}
            </this.props.tableHeadRowComponent>
        );
    }
}
