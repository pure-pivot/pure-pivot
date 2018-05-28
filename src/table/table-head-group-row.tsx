import * as React from 'react';
import { TableHeadGroupCellProps } from './table-head-group-cell';
import { GroupHeaderRow, TableDescription } from './model';

export interface TableHeadGroupRowProps<D> {
    row: GroupHeaderRow;
    tableDescription: TableDescription<D>;
    tableHeadRowComponent: React.ReactType;
    tableHeadGroupCellComponent: React.ComponentType<TableHeadGroupCellProps<D>>;
}

export type TableHeadGroupRowProvidedProps = 'tableHeadRowComponent' | 'tableHeadGroupCellComponent';

export class TableHeadGroupRow<D> extends React.Component<TableHeadGroupRowProps<D>, never> {
    render() {
        const sums: number[] = [1];
        for (const rowGroup of this.props.row.groups) {
            sums.push(sums[sums.length - 1] + rowGroup.subColumnSize * this.props.tableDescription.valueCount);
        }

        return <this.props.tableHeadRowComponent>
            <this.props.tableHeadGroupCellComponent scope="row" colStart={0} colSpan={1} tableDescription={this.props.tableDescription}>
                {this.props.row.label}
            </this.props.tableHeadGroupCellComponent>
            {this.props.row.groups.map((rowGroup, index) =>
                <this.props.tableHeadGroupCellComponent key={index} scope="col" colStart={sums[index]} colSpan={rowGroup.subColumnSize * this.props.tableDescription.valueCount} tableDescription={this.props.tableDescription}>
                    {rowGroup.label}
                </this.props.tableHeadGroupCellComponent>
            )}
        </this.props.tableHeadRowComponent>;
    }
}
