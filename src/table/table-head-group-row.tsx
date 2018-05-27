import * as React from 'react';
import { Grouping } from '../groups/apply-grouping';
import { Groups } from '../groups/model';
import { ValueReducers } from '../values/model';
import { TableHeadCellProps } from './table-head-cell';
import { GroupHeaderRow, TableDescription, isGroupHeaderRow } from './model';

export interface TableHeadGroupRowProps<D> {
    row: GroupHeaderRow;
    tableDescription: TableDescription<D>;
    tableHeadRowComponent: React.ReactType;
    tableHeadCellComponent: React.ComponentType<TableHeadCellProps>;
}

export type TableHeadGroupRowProvidedProps = 'tableHeadRowComponent' | 'tableHeadCellComponent';

export class TableHeadGroupRow<D> extends React.Component<TableHeadGroupRowProps<D>, never> {
    render() {
        return <this.props.tableHeadRowComponent>
            <this.props.tableHeadCellComponent scope="row" colSpan={1}>
                {this.props.row.label}
            </this.props.tableHeadCellComponent>
            {this.props.row.groups.map((rowGroup, index) =>
                <this.props.tableHeadCellComponent key={index} scope="col" colSpan={rowGroup.subColumnSize * this.props.tableDescription.valueCount}>
                    {rowGroup.label}
                </this.props.tableHeadCellComponent>
            )}
        </this.props.tableHeadRowComponent>;
    }
}
