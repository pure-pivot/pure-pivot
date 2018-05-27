import * as React from 'react';
import { Grouping } from '../groups/apply-grouping';
import { Groups } from '../groups/model';
import { ValueReducers } from '../values/model';
import { TableHeadCellProps } from './table-head-cell';
import { GroupHeaderRow, TableDescription, isGroupHeaderRow } from './model';

export interface TableHeadGroupColumnsProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadRowComponent: React.ReactType;
    tableHeadCellComponent: React.ComponentType<TableHeadCellProps>;
}

export type TableHeadGroupColumnsProvidedProps = 'tableHeadRowComponent' | 'tableHeadCellComponent';

export class TableHeadGroupColumns<D> extends React.Component<TableHeadGroupColumnsProps<D>, never> {
    render() {
        return this.props.tableDescription.headRows.filter(isGroupHeaderRow).map((row, index) =>
            <this.props.tableHeadRowComponent key={index}>
                <this.props.tableHeadCellComponent scope="row" colSpan={1}>
                    {row.label}
                </this.props.tableHeadCellComponent>
                {row.groups.map((rowGroup, index) =>
                    <this.props.tableHeadCellComponent key={index} scope="col" colSpan={rowGroup.subColumnSize * this.props.tableDescription.valueCount}>
                        {rowGroup.label}
                    </this.props.tableHeadCellComponent>
                )}
            </this.props.tableHeadRowComponent>
        );
    }
}
