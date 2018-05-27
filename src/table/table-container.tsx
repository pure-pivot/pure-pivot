import * as React from 'react';
import { TableHeadProps, TableHeadProvidedProps } from './table-head';
import { TableBodyProps, TableBodyProvidedProps } from './table-body';
import { ValueReducers } from '../values/model';
import { GroupHeaderRow, ValueHeaderRow, BodyRow, TableDescription } from './model';

export interface TableContainerProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadComponent: React.ComponentType<Pick<TableHeadProps<D>, Exclude<keyof TableHeadProps<D>, TableHeadProvidedProps>>>;
    tableBodyComponent: React.ComponentType<Pick<TableBodyProps<D>, Exclude<keyof TableBodyProps<D>, TableBodyProvidedProps>>>;
}

export type TableContainerProvidedProps = 'tableHeadComponent' | 'tableBodyComponent';

export class TableContainer<D> extends React.Component<TableContainerProps<D>, never> {
    render() {
        return <table>
            <this.props.tableHeadComponent tableDescription={this.props.tableDescription} />
            <this.props.tableBodyComponent tableDescription={this.props.tableDescription} />
        </table>;
    }
}
