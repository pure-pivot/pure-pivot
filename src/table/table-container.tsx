import * as React from 'react';
import { TableDescription } from './model';
import { TableHeadProps, TableHeadProvidedProps } from './table-head';
import { TableBodyProps, TableBodyProvidedProps } from './table-body';
import { TableFootProps } from './table-foot';

export interface TableContainerProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadComponent: React.ComponentType<Pick<TableHeadProps<D>, Exclude<keyof TableHeadProps<D>, TableHeadProvidedProps>>>;
    tableBodyComponent: React.ComponentType<Pick<TableBodyProps<D>, Exclude<keyof TableBodyProps<D>, TableBodyProvidedProps>>>;
    tableFootComponent: React.ComponentType<TableFootProps<D>>;
}

export type TableContainerProvidedProps = 'tableHeadComponent' | 'tableBodyComponent' | 'tableFootComponent';

export class TableContainer<D> extends React.Component<TableContainerProps<D>, never> {
    render() {
        return <table>
            <this.props.tableHeadComponent tableDescription={this.props.tableDescription} />
            <this.props.tableBodyComponent tableDescription={this.props.tableDescription} />
            <this.props.tableFootComponent tableDescription={this.props.tableDescription} />
        </table>;
    }
}
