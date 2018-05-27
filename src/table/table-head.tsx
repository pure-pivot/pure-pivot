import * as React from 'react';
import { Grouping } from '../groups/apply-grouping';
import { Groups } from '../groups/model';
import { ValueReducers } from '../values/model';
import { TableHeadGroupColumnsProps, GroupHeaderRow, TableHeadGroupColumnsProvidedProps } from './table-head-group-columns';
import { TableHeadValueColumnsProps, ValueHeaderRow, TableHeadValueColumnsProvidedProps } from './table-head-value-columns';

export interface TableHeadProps<D> {
    groupHeaderRows: GroupHeaderRow[];
    valueHeaderRow: ValueHeaderRow;
    columnCount: number;
    valueCount: number;
    tableHeadGroupColumnsComponent: React.ComponentType<Pick<TableHeadGroupColumnsProps<D>, Exclude<keyof TableHeadGroupColumnsProps<D>, TableHeadGroupColumnsProvidedProps>>>;
    tableHeadValueColumnsComponent: React.ComponentType<Pick<TableHeadValueColumnsProps<D>, Exclude<keyof TableHeadValueColumnsProps<D>, TableHeadValueColumnsProvidedProps>>>;
}

export type TableHeadProvidedProps = 'tableHeadGroupColumnsComponent' | 'tableHeadValueColumnsComponent';

export class TableHead<D> extends React.Component<TableHeadProps<D>, never> {
    render() {
        return <thead>
            <this.props.tableHeadGroupColumnsComponent rows={this.props.groupHeaderRows} valueCount={this.props.valueCount} />
            <this.props.tableHeadValueColumnsComponent row={this.props.valueHeaderRow} />
        </thead>;
    }
}
