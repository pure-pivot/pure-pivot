import * as React from 'react';
import { Grouping } from '../groups/apply-grouping';
import { Groups } from '../groups/model';
import { ValueReducers } from '../values/model';
import { TableHeadGroupRowsProps, TableHeadGroupRowsProvidedProps } from './table-head-group-rows';
import { TableHeadValueRowsProps, TableHeadValueRowsProvidedProps } from './table-head-value-rows';
import { HeadRow, GroupHeaderRow, ValueHeaderRow, isGroupHeaderRow, isValueHeaderRow, TableDescription } from './model';

export interface TableHeadProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadGroupRowsComponent: React.ComponentType<Pick<TableHeadGroupRowsProps<D>, Exclude<keyof TableHeadGroupRowsProps<D>, TableHeadGroupRowsProvidedProps>>>;
    tableHeadValueRowsComponent: React.ComponentType<Pick<TableHeadValueRowsProps<D>, Exclude<keyof TableHeadValueRowsProps<D>, TableHeadValueRowsProvidedProps>>>;
}

export type TableHeadProvidedProps = 'tableHeadGroupRowsComponent' | 'tableHeadValueRowsComponent';

export class TableHead<D> extends React.Component<TableHeadProps<D>, never> {
    render() {
        return <thead>
            <this.props.tableHeadGroupRowsComponent tableDescription={this.props.tableDescription} />
            <this.props.tableHeadValueRowsComponent tableDescription={this.props.tableDescription} />
        </thead>;
    }
}
