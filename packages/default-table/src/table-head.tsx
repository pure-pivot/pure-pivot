import * as React from 'react';
import { TableHeadRowsProps, TableHeadRowsProvidedProps } from './table-head-rows';
import { TableDescription } from '@pure-pivot/core/lib/es6/table/model';

export interface TableHeadProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadRowsComponent: React.ComponentType<Pick<TableHeadRowsProps<D>, Exclude<keyof TableHeadRowsProps<D>, TableHeadRowsProvidedProps>>>;
}

export type TableHeadProvidedProps = 'tableHeadRowsComponent';

export class TableHead<D> extends React.Component<TableHeadProps<D>, never> {
    render() {
        return <thead>
            <this.props.tableHeadRowsComponent tableDescription={this.props.tableDescription} />
        </thead>;
    }
}
