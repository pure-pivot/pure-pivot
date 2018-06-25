import * as React from 'react';
import { TableDescription } from '@pure-pivot/core/lib/es6/table/model';
import { TableBodyRowsProps, TableBodyRowsProvidedProps } from './table-body-rows';

export interface TableBodyProps<D> {
    columnWidths: number[];
    scrollTop: number;
    rowHeight: number;
    headHeight: number;
    start: number;
    end: number;
    tableDescription: TableDescription<D>;
    tableBodyRowsComponent: React.ComponentType<Pick<TableBodyRowsProps<D>, Exclude<keyof TableBodyRowsProps<D>, TableBodyRowsProvidedProps>>>;
}

export type TableBodyProvidedProps = 'tableBodyRowsComponent';

export class TableBody<D> extends React.Component<TableBodyProps<D>, never> {
    render() {
        return <div style={{
            display: 'grid',
            position: 'absolute',
            gridAutoRows: this.props.rowHeight,
            gridTemplateColumns: this.props.columnWidths.map((size) => `${size}px`).join(' '),
            top: this.props.headHeight + this.props.start * this.props.rowHeight
        }}>
            <this.props.tableBodyRowsComponent tableDescription={this.props.tableDescription} start={this.props.start} end={this.props.end} />
        </div>;
    }
}
