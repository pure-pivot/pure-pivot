import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyFirstCellProps } from './table-body-first-cell';
import { TableDescription } from './model';

export interface TableBodyRowsProps<D> {
    tableDescription: TableDescription<D>;
    tableBodyRowComponent: React.ReactType;
    tableBodyFirstCellComponent: React.ComponentType<TableBodyFirstCellProps>;
    tableBodyCellComponent: React.ReactType;
}

export type TableBodyRowsProvidedProps = 'tableBodyRowComponent' | 'tableBodyFirstCellComponent' | 'tableBodyCellComponent';

export class TableBodyRows<D> extends React.Component<TableBodyRowsProps<D>, never> {
    shouldComponentUpdate(prevProps: TableBodyRowsProps<D>) {
        return !shallowEqual(this.props, prevProps);
    }

    render() {
        return this.props.tableDescription.bodyRows.map((row, index) =>
            <this.props.tableBodyRowComponent key={index}>
                <this.props.tableBodyFirstCellComponent level={row.level}>
                    {row.label}
                </this.props.tableBodyFirstCellComponent>
                {row.data.map((cell, index) =>
                    this.props.tableDescription.values.map((valueDescription) =>
                        <this.props.tableBodyCellComponent key={`${valueDescription.id}-${index}`}>
                            {valueDescription.reducer(cell)}
                        </this.props.tableBodyCellComponent>
                    )
                )}
            </this.props.tableBodyRowComponent>
        );
    }
}
