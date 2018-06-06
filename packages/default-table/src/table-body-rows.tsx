import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyCellProps } from './table-body-cell';
import { TableDescription, HeadColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';
import { getBodyRowCellId } from '@pure-pivot/core/lib/es6/util/id-helper';

export interface TableBodyRowsProps<D> {
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
        const headColumn: HeadColumnDescriptor = { type: 'head-column' };

        return this.props.tableDescription.bodyRows.map((row, index) =>
            <this.props.tableBodyRowComponent key={index}>
                <this.props.tableBodyCellComponent
                    id={getBodyRowCellId(index, headColumn)}
                    row={row}
                    column={headColumn}
                >
                    {row.label}
                </this.props.tableBodyCellComponent>
                {row.cells.map((cell) => {
                    const id = getBodyRowCellId(index, cell.column);
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
