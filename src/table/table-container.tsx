import * as React from 'react';
import { TableHeadProps, TableHeadProvidedProps } from './table-head';
import { TableBodyProps, TableBodyProvidedProps } from './table-body';
import { GroupHeaderRow } from './table-head-group-columns';
import { ValueHeaderRow } from './table-head-value-columns';
import { ValueReducers } from '../values/model';
import { BodyRow } from './table-body-rows';

export interface TableContainerProps<D> {
    groupHeaderRows: GroupHeaderRow[];
    valueHeaderRow: ValueHeaderRow;
    columnCount: number;
    values: ValueReducers<D>;
    bodyRows: BodyRow<D>[];
    tableHeadComponent: React.ComponentType<Pick<TableHeadProps<D>, Exclude<keyof TableHeadProps<D>, TableHeadProvidedProps>>>;
    tableBodyComponent: React.ComponentType<Pick<TableBodyProps<D>, Exclude<keyof TableBodyProps<D>, TableBodyProvidedProps>>>;
}

export type TableContainerProvidedProps = 'tableHeadComponent' | 'tableBodyComponent';

export class TableContainer<D> extends React.Component<TableContainerProps<D>, never> {
    render() {
        return <table>
            <this.props.tableHeadComponent
                groupHeaderRows={this.props.groupHeaderRows}
                valueHeaderRow={this.props.valueHeaderRow}
                columnCount={this.props.columnCount}
                valueCount={this.props.values.length}
            />
            <this.props.tableBodyComponent
                values={this.props.values}
                bodyRows={this.props.bodyRows}
            />
        </table>;
    }
}
