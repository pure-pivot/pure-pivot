import * as React from 'react';
import { Grouping } from '../groups/apply-grouping';
import { Groups } from '../groups/model';
import { ValueReducers } from '../values/model';
import { TableHeadGroupColumnsProps, TableHeadGroupColumnsProvidedProps } from './table-head-group-columns';
import { TableHeadValueColumnsProps, TableHeadValueColumnsProvidedProps } from './table-head-value-columns';
import { HeadRow, GroupHeaderRow, ValueHeaderRow, isGroupHeaderRow, isValueHeaderRow, TableDescription } from './model';

export interface TableHeadProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadGroupColumnsComponent: React.ComponentType<Pick<TableHeadGroupColumnsProps<D>, Exclude<keyof TableHeadGroupColumnsProps<D>, TableHeadGroupColumnsProvidedProps>>>;
    tableHeadValueColumnsComponent: React.ComponentType<Pick<TableHeadValueColumnsProps<D>, Exclude<keyof TableHeadValueColumnsProps<D>, TableHeadValueColumnsProvidedProps>>>;
}

export type TableHeadProvidedProps = 'tableHeadGroupColumnsComponent' | 'tableHeadValueColumnsComponent';

export class TableHead<D> extends React.Component<TableHeadProps<D>, never> {
    render() {
        return <thead>
            <this.props.tableHeadGroupColumnsComponent tableDescription={this.props.tableDescription} />
            <this.props.tableHeadValueColumnsComponent tableDescription={this.props.tableDescription} />
        </thead>;
    }
}
