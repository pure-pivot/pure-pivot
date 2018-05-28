import * as React from 'react';
import { TableHeadValueCellProps } from './table-head-value-cell';
import { ValueHeaderRow, TableDescription } from './model';

export interface TableHeadValueRowProps<D> {
    row: ValueHeaderRow;
    tableDescription: TableDescription<D>;
    tableHeadRowComponent: React.ReactType;
    tableHeadValueCellComponent: React.ComponentType<TableHeadValueCellProps<D>>;
}

export type TableHeadValueRowProvidedProps = 'tableHeadRowComponent' | 'tableHeadValueCellComponent';

export class TableHeadValueRow<D> extends React.Component<TableHeadValueRowProps<D>, never> {
    render() {
        return <this.props.tableHeadRowComponent>
            <this.props.tableHeadValueCellComponent
                scope="row"
                colStart={0}
                colSpan={1}
                column={{ type: 'head-column' }}
                tableDescription={this.props.tableDescription}
            >
                Values
            </this.props.tableHeadValueCellComponent>
            {this.props.row.columns.map((value, index) =>
                <this.props.tableHeadValueCellComponent
                    key={`${value.groupDescriptors.map((group) => `${group.groupId}-${group.groupIndex}`).join('-')}-${value.valueId}`}
                    scope="col"
                    colStart={1 + index}
                    colSpan={1}
                    column={value}
                    tableDescription={this.props.tableDescription}
                >
                    {value.label}
                </this.props.tableHeadValueCellComponent>
            )}
        </this.props.tableHeadRowComponent>;
    }
}
