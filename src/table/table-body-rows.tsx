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
    shouldComponentUpdate(nextProps: TableBodyRowsProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return this.props.tableDescription.bodyRows.map((row, index) =>
            <this.props.tableBodyRowComponent key={index}>
                <this.props.tableBodyCellComponent
                    id={`body-row-${index}-head-column`}
                    row={row}
                    column={{ type: 'head-column' }}
                >
                    {row.label}
                </this.props.tableBodyCellComponent>
                {row.cells.map((cell) => {
                    const id = `body-row-${index}-${cell.column.groupDescriptors.map((group) => `${group.groupId}-${group.groupIndex}`).join('-')}-value-${cell.column.valueDescription.id}`;
                    return <this.props.tableBodyCellComponent
                        key={id}
                        id={id}
                        row={row}
                        column={cell.column}
                    >
                        {cell.column.valueDescription.reducer(cell.data)}
                    </this.props.tableBodyCellComponent>;
                })}
            </this.props.tableBodyRowComponent>
        );
    }
}
