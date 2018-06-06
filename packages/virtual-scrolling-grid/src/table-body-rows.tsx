import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableDescription } from '@pure-pivot/core/lib/es6/table/model';
import { TableBodyCellProps } from '@pure-pivot/core/lib/es6/table/table-body-cell';

export interface TableBodyRowsProps<D> {
    start: number;
    end: number;
    tableDescription: TableDescription<D>;
    tableBodyRowComponent: React.ReactType;
    tableBodyCellComponent: React.ComponentType<TableBodyCellProps<D>>;
}

export type TableBodyRowsProvidedProps = 'tableBodyRowComponent' | 'tableBodyCellComponent';

export class TableBodyRows<D> extends React.Component<TableBodyRowsProps<D>, never> {
    shouldComponentUpdate(nextProps: TableBodyRowsProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return this.props.tableDescription.bodyRows.slice(this.props.start, this.props.end).map((row, index) =>
            <this.props.tableBodyRowComponent key={this.props.start + index}>
                <this.props.tableBodyCellComponent
                    id={`body-row-${this.props.start + index}-head-column`}
                    row={row}
                    column={{ type: 'head-column' }}
                >
                    {row.label}
                </this.props.tableBodyCellComponent>
                {row.cells.map((cell) => {
                    const id = `body-row-${this.props.start + index}-${cell.column.groupDescriptors.map((group) => `${group.groupId}-${group.groupIndex}`).join('-')}-value-${cell.column.valueDescription.id}`;
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
