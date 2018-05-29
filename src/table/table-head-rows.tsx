import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableHeadGroupRowProps, TableHeadGroupRowProvidedProps } from './table-head-group-row';
import { TableHeadValueRowProps, TableHeadValueRowProvidedProps } from './table-head-value-row';
import { TableDescription, isGroupHeaderRow, isValueHeaderRow } from './model';

export interface TableHeadRowsProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadGroupRowsComponent: React.ComponentType<Pick<TableHeadGroupRowProps<D>, Exclude<keyof TableHeadGroupRowProps<D>, TableHeadGroupRowProvidedProps>>>;
    tableHeadValueRowsComponent: React.ComponentType<Pick<TableHeadValueRowProps<D>, Exclude<keyof TableHeadValueRowProps<D>, TableHeadValueRowProvidedProps>>>;
}

export type TableHeadRowsProvidedProps = 'tableHeadGroupRowsComponent' | 'tableHeadValueRowsComponent';

export class TableHeadRows<D> extends React.Component<TableHeadRowsProps<D>, never> {
    shouldComponentUpdate(prevProps: TableHeadRowsProps<D>) {
        return !shallowEqual(this.props, prevProps);
    }

    render() {
        return this.props.tableDescription.headRows.map((headRow, index) => {
            if (isGroupHeaderRow(headRow)) {
                return <this.props.tableHeadGroupRowsComponent key={headRow.groupId} tableDescription={this.props.tableDescription} row={headRow} />;
            } else if (isValueHeaderRow(headRow)) {
                return <this.props.tableHeadValueRowsComponent key={`value-row-${index}`} tableDescription={this.props.tableDescription} row={headRow} />;
            } else {
                // TODO: investigate custom head rows
                // return <headRow.renderer tableDescription={this.props.tableDescription} />;
            }
        });
    }
}
