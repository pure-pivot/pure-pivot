import * as React from 'react';
import { TableHeadGroupCellProps } from './table-head-group-cell';
import { GroupHeaderRow, TableDescription } from '@pure-pivot/core/lib/es6/table/model';
import { getHeadGroupRowCellId } from '@pure-pivot/core/lib/es6/util/id-helper';

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
        for (const column of this.props.row.groups) {
            sums.push(sums[sums.length - 1] + column.subColumnSize * this.props.tableDescription.valueCount);
        }

        return <this.props.tableHeadRowComponent>
            {this.props.tableDescription.columns.map((column) => {
                if (column.type === 'head-column') {
                    const id = getHeadGroupRowCellId(this.props.row.groupId, column);
                    return <this.props.tableHeadGroupCellComponent
                        key={id}
                        scope="row"
                        colStart={0}
                        colSpan={1}
                        id={id}
                        row={this.props.row}
                        column={column}
                        tableDescription={this.props.tableDescription}
                    >
                        {this.props.row.groupLabel}
                    </this.props.tableHeadGroupCellComponent>;
                }
            })}
            {this.props.row.groups.map((column, index) => {
                const id = getHeadGroupRowCellId(this.props.row.groupId, column);
                return <this.props.tableHeadGroupCellComponent
                    key={id}
                    id={id}
                    scope="col"
                    colStart={sums[index]}
                    colSpan={column.subColumnSize * this.props.tableDescription.valueCount}
                    row={this.props.row}
                    column={column}
                    tableDescription={this.props.tableDescription}
                >
                    {column.label}
                </this.props.tableHeadGroupCellComponent>;
            })}
        </this.props.tableHeadRowComponent>;
    }
}
