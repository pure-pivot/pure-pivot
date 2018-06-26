import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyCellProps } from './table-body-cell';
import { TableBodyRowProps } from './table-body-row';
import { TableDescription } from '@pure-pivot/core/lib/es6/table/model';
import { getBodyRowCellId } from '@pure-pivot/core/lib/es6/util/id-helper';

export interface TableBodyRowsProps<D> {
    tableDescription: TableDescription<D>;
    tableBodyRowComponent: React.ComponentType<TableBodyRowProps<D>>;
    tableBodyCellComponent: React.ComponentType<TableBodyCellProps<D>>;
}

export type TableBodyRowsProvidedProps = 'tableBodyRowComponent' | 'tableBodyCellComponent';

export class TableBodyRows<D> extends React.Component<TableBodyRowsProps<D>, never> {
    shouldComponentUpdate(nextProps: TableBodyRowsProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return this.props.tableDescription.bodyRows.map((row, index) =>
            <this.props.tableBodyRowComponent key={index} row={row}>
                {this.props.tableDescription.columns.filter((column) => column.type === 'head-column').map((column) => {
                    const id = getBodyRowCellId(index, column);
                    return <this.props.tableBodyCellComponent
                        key={id}
                        id={id}
                        row={row}
                        column={column}
                    >
                        {row.label}
                    </this.props.tableBodyCellComponent>;
                })}
                {row.cells.map((cell) => {
                    const id = getBodyRowCellId(index, cell.column);
                    return <this.props.tableBodyCellComponent
                        key={id}
                        id={id}
                        row={row}
                        column={cell.column}
                    >
                        {cell.column.valueDescription.renderer(cell.value)}
                    </this.props.tableBodyCellComponent>;
                })}
            </this.props.tableBodyRowComponent>
        );
    }
}
