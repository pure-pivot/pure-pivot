import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyCellProps } from './table-body-cell';
import { TableDescription } from './model';

export interface TableBodyRowsProps<D> {
    tableDescription: TableDescription<D>;
    tableBodyRowComponent: React.ReactType;
    tableBodyCellComponent: React.ComponentType<TableBodyCellProps<D>>;
}

export type TableBodyRowsProvidedProps = 'tableBodyRowComponent' | 'tableBodyFirstCellComponent' | 'tableBodyCellComponent';

export class TableBodyRows<D> extends React.Component<TableBodyRowsProps<D>, never> {
    shouldComponentUpdate(prevProps: TableBodyRowsProps<D>) {
        return !shallowEqual(this.props, prevProps);
    }

    render() {
        return this.props.tableDescription.bodyRows.map((row, index) =>
            <this.props.tableBodyRowComponent key={index}>
                <this.props.tableBodyCellComponent
                    row={row}
                    column={{ type: 'head-column' }}
                >
                    {row.label}
                </this.props.tableBodyCellComponent>
                {row.cells.map((cell) =>
                    <this.props.tableBodyCellComponent
                        key={`${cell.column.groupDescriptors.map((group) => `${group.groupId}-${group.groupIndex}`).join('-')}-${cell.column.valueDescription.id}`}
                        row={row}
                        column={cell.column}
                    >
                        {cell.column.valueDescription.reducer(cell.data)}
                    </this.props.tableBodyCellComponent>
                )}
            </this.props.tableBodyRowComponent>
        );
    }
}
