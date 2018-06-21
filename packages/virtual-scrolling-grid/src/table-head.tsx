import * as React from 'react';
import { TableDescription } from '@pure-pivot/core/lib/es6/table/model';
import { TableHeadRowsProps, TableHeadRowsProvidedProps } from '@pure-pivot/default-table/lib/es6/table-head-rows';

export interface TableHeadProps<D> {
    sizes: number[];
    scrollTop: number;
    tableDescription: TableDescription<D>;
    tableHeadRowsComponent: React.ComponentType<Pick<TableHeadRowsProps<D>, Exclude<keyof TableHeadRowsProps<D>, TableHeadRowsProvidedProps>>>;
}

export type TableHeadProvidedProps = 'tableHeadRowsComponent';

export class TableHead<D> extends React.Component<TableHeadProps<D>, never> {
    render() {
        return <div style={{ display: 'grid', position: 'absolute', width: '100%', gridTemplateColumns: this.props.sizes.map((fraction) => `${fraction * 100}%`).join(' '), top: this.props.scrollTop, backgroundColor: 'white' }}>
            <this.props.tableHeadRowsComponent tableDescription={this.props.tableDescription} />
        </div>;
    }
}
