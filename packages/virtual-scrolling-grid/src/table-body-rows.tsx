import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableDescription, HeadColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';
import { TableBodyCellProps } from '@pure-pivot/default-table/lib/es6/table-body-cell';
import { getBodyRowCellId } from '@pure-pivot/core/lib/es6/util/id-helper';

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
        const headColumn: HeadColumnDescriptor = { type: 'head-column' };

        return this.props.tableDescription.bodyRows.slice(this.props.start, this.props.end).map((row, index) =>
            <this.props.tableBodyRowComponent key={this.props.start + index}>
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
                        {cell.column.valueDescription.renderer(cell.value)}
                    </this.props.tableBodyCellComponent>;
                })}
            </this.props.tableBodyRowComponent>
        );
    }
}
