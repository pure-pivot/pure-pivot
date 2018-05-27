import * as React from 'react';
import { Grouping } from '../groups/apply-grouping';
import { Groups } from '../groups/model';
import { ValueReducers } from '../values/model';
import { TableHeadCellProps } from './table-head-cell';
import { ValueHeaderRow, TableDescription, isValueHeaderRow } from './model';

export interface TableHeadValueColumnsProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadRowComponent: React.ReactType;
    tableHeadCellComponent: React.ComponentType<TableHeadCellProps>;
}

export type TableHeadValueColumnsProvidedProps = 'tableHeadRowComponent' | 'tableHeadCellComponent';

export class TableHeadValueColumns<D> extends React.Component<TableHeadValueColumnsProps<D>, never> {
    render() {
        return this.props.tableDescription.headRows.filter(isValueHeaderRow).map((row, index) =>
            <this.props.tableHeadRowComponent key={index}>
                <this.props.tableHeadCellComponent scope="row" colSpan={1}>
                    Values
            </this.props.tableHeadCellComponent>
                {row.labels.map((label, index) =>
                    <this.props.tableHeadCellComponent key={index} scope="col" colSpan={1}>
                        {label}
                    </this.props.tableHeadCellComponent>
                )}
            </this.props.tableHeadRowComponent>
        );
    }
}
