import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyRowsProps } from '../../../table/table-body-rows';

export interface PaginatedTableBodyRowsState {
    offset: number;
    limit: number;
}

export function tableBodyRowsFactory<D>(initialOffset: number, initialLimit: number, setListener: (listener: (offset: number, limit: number) => void) => void) {
    return class TableBodyRows<D> extends React.Component<TableBodyRowsProps<D>, PaginatedTableBodyRowsState> {
        state: PaginatedTableBodyRowsState = {
            offset: initialOffset,
            limit: initialLimit
        };

        constructor(props: TableBodyRowsProps<D>) {
            super(props);

            setListener((offset: number, limit: number) => this.setState({ offset, limit }));
        }

        shouldComponentUpdate(prevProps: TableBodyRowsProps<D>, prevState: PaginatedTableBodyRowsState) {
            return !shallowEqual(this.props, prevProps) || !shallowEqual(this.state, prevState);
        }

        render() {
            return this.props.tableDescription.bodyRows.slice(this.state.offset, this.state.offset + this.state.limit).map((row, index) =>
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
    };
}
