import * as React from 'react';
import { Grouping, RecursiveGroup } from '../groups/apply-grouping';
import { applySorting } from '../sorting/apply-sorting';
import { ValueReducers } from '../values/model';
import { Comparators } from '../sorting/model';
import { TableBodyRowsProps, TableBodyRowsProvidedProps } from './table-body-rows';
import { BodyRow, TableDescription } from './model';

export interface TableBodyProps<D> {
    tableDescription: TableDescription<D>;
    tableBodyRowsComponent: React.ComponentType<Pick<TableBodyRowsProps<D>, Exclude<keyof TableBodyRowsProps<D>, TableBodyRowsProvidedProps>>>;
}

export type TableBodyProvidedProps = 'tableBodyRowsComponent';

export class TableBody<D> extends React.Component<TableBodyProps<D>, never> {
    render() {
        return <tbody>
            <this.props.tableBodyRowsComponent tableDescription={this.props.tableDescription} />
        </tbody>;
    }
}
