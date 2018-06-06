import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableDescription } from '@pure-pivot/core/lib/es6/table/model';
import { TableHeadProps, TableHeadProvidedProps } from './table-head';
import { TableBodyProps, TableBodyProvidedProps } from './table-body';

export interface TableContainerProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadComponent: React.ComponentType<Pick<TableHeadProps<D>, Exclude<keyof TableHeadProps<D>, TableHeadProvidedProps>>>;
    tableBodyComponent: React.ComponentType<Pick<TableBodyProps<D>, Exclude<keyof TableBodyProps<D>, TableBodyProvidedProps>>>;
}

export type TableContainerProvidedProps = 'tableHeadComponent' | 'tableBodyComponent';

export class TableContainer<D> extends React.Component<TableContainerProps<D>, never> {
    shouldComponentUpdate(nextProps: TableContainerProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return <table>
            <this.props.tableHeadComponent tableDescription={this.props.tableDescription} />
            <this.props.tableBodyComponent tableDescription={this.props.tableDescription} />
        </table>;
    }
}
