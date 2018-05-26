import * as React from 'react';
import { Grouping, RecursiveGroup } from '../groups/apply-grouping';
import { applySorting } from '../sorting/apply-sorting';
import { ValueReducers } from '../values/model';
import { Comparators } from '../sorting/model';
import { TableHeadCellProps } from './table-head-cell';
import { TableBodyFirstCellProps } from './table-body-first-cell';

export interface BodyRow<D> {
    type: 'body-row';
    level: number;
    label: string;
    data: D[][];
}

export interface TableBodyRowsProps<D> {
    values: ValueReducers<D>;
    bodyRows: BodyRow<D>[];
    tableBodyRowComponent: React.ReactType;
    tableBodyFirstCellComponent: React.ComponentType<TableBodyFirstCellProps>;
    tableBodyCellComponent: React.ReactType;
}

export type TableBodyRowsProvidedProps = 'tableBodyRowComponent' | 'tableBodyFirstCellComponent' | 'tableBodyCellComponent';

export class TableBodyRows<D> extends React.Component<TableBodyRowsProps<D>, never> {
    render() {
        return this.props.bodyRows.map((row, index) =>
            <this.props.tableBodyRowComponent key={index}>
                <this.props.tableBodyFirstCellComponent level={row.level}>
                    {row.label}
                </this.props.tableBodyFirstCellComponent>
                {row.data.map((cell, index) =>
                    this.props.values.map((valueDescription) =>
                        <this.props.tableBodyCellComponent key={`${valueDescription.id}-${index}`}>
                            {valueDescription.reducer(cell)}
                        </this.props.tableBodyCellComponent>
                    )
                )}
            </this.props.tableBodyRowComponent>
        );
    }
}
