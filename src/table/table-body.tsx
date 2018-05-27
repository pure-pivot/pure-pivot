import * as React from 'react';
import { Grouping, RecursiveGroup } from '../groups/apply-grouping';
import { applySorting } from '../sorting/apply-sorting';
import { ValueReducers } from '../values/model';
import { Comparators } from '../sorting/model';
import { TableBodyRowsProps, BodyRow, TableBodyRowsProvidedProps } from './table-body-rows';

export interface TableBodyProps<D> {
    values: ValueReducers<D>;
    bodyRows: BodyRow<D>[];
    columnCount: number;
    tableBodyRowsComponent: React.ComponentType<Pick<TableBodyRowsProps<D>, Exclude<keyof TableBodyRowsProps<D>, TableBodyRowsProvidedProps>>>;
}

export type TableBodyProvidedProps = 'tableBodyRowsComponent';

export class TableBody<D> extends React.Component<TableBodyProps<D>, never> {
    render() {
        return <tbody>
            <this.props.tableBodyRowsComponent values={this.props.values} bodyRows={this.props.bodyRows} />
        </tbody>;
    }
}
