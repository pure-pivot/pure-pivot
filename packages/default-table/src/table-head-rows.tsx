import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableHeadGroupRowProps, TableHeadGroupRowProvidedProps } from './table-head-group-row';
import { TableHeadValueRowProps, TableHeadValueRowProvidedProps } from './table-head-value-row';
import { TableDescription } from './model';

export interface TableHeadRowsProps<D> {
    tableDescription: TableDescription<D>;
    tableHeadGroupRowComponent: React.ComponentType<Pick<TableHeadGroupRowProps<D>, Exclude<keyof TableHeadGroupRowProps<D>, TableHeadGroupRowProvidedProps>>>;
    tableHeadValueRowComponent: React.ComponentType<Pick<TableHeadValueRowProps<D>, Exclude<keyof TableHeadValueRowProps<D>, TableHeadValueRowProvidedProps>>>;
}

export type TableHeadRowsProvidedProps = 'tableHeadGroupRowComponent' | 'tableHeadValueRowComponent';

export class TableHeadRows<D> extends React.Component<TableHeadRowsProps<D>, never> {
    shouldComponentUpdate(nextProps: TableHeadRowsProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return <React.Fragment>
            {this.props.tableDescription.headGroupRows.map((groupRow) =>
                <this.props.tableHeadGroupRowComponent key={groupRow.groupId} tableDescription={this.props.tableDescription} row={groupRow} />
            )}
            <this.props.tableHeadValueRowComponent key="value-row" tableDescription={this.props.tableDescription} row={this.props.tableDescription.headValueRow} />
        </React.Fragment>;
    }
}
