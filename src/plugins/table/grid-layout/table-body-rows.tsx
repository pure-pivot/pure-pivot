import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyRowsProps } from '../../../table/table-body-rows';

export interface PaginatedTableBodyRowsProps<D> extends TableBodyRowsProps<D> {
    offset: number;
    limit: number;
}

export class TableBodyRows<D> extends React.Component<PaginatedTableBodyRowsProps<D>, never> {
    shouldComponentUpdate(prevProps: PaginatedTableBodyRowsProps<D>) {
        return !shallowEqual(this.props, prevProps);
    }

    render() {
        return this.props.tableDescription.bodyRows.slice(this.props.offset, this.props.offset + this.props.limit).map((row, index) =>
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
