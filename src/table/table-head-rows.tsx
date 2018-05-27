import * as React from 'react';
import { TableHeadGroupRowProps, TableHeadGroupRowProvidedProps } from './table-head-group-row';
import { TableHeadValueRowProps, TableHeadValueRowProvidedProps } from './table-head-value-row';
import { TableDescription, isGroupHeaderRow } from './model';

export interface TableHeadRowsProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadGroupRowsComponent: React.ComponentType<Pick<TableHeadGroupRowProps<D>, Exclude<keyof TableHeadGroupRowProps<D>, TableHeadGroupRowProvidedProps>>>;
    tableHeadValueRowsComponent: React.ComponentType<Pick<TableHeadValueRowProps<D>, Exclude<keyof TableHeadValueRowProps<D>, TableHeadValueRowProvidedProps>>>;
}

export type TableHeadRowsProvidedProps = 'tableHeadGroupRowsComponent' | 'tableHeadValueRowsComponent';

export class TableHeadRows<D> extends React.Component<TableHeadRowsProps<D>, never> {
    render() {
        return this.props.tableDescription.headRows.map((headRow, index) => {
            if (isGroupHeaderRow(headRow)) {
                return <this.props.tableHeadGroupRowsComponent key={index} tableDescription={this.props.tableDescription} row={headRow} />;
            } else {
                return <this.props.tableHeadValueRowsComponent key={index} tableDescription={this.props.tableDescription} row={headRow} />;
            }
        });
    }
}
