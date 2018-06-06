import * as React from 'react';
import { TableBodyRowsProps, TableBodyRowsProvidedProps } from './table-body-rows';
import { TableDescription } from '@pure-pivot/core/lib/es6/table/model';

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
