import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableHeadGroupRowProps, TableHeadGroupRowProvidedProps } from './table-head-group-row';
import { TableHeadValueRowProps, TableHeadValueRowProvidedProps } from './table-head-value-row';
import { TableDescription, HeadRowDOMDescription } from './model';
import { domDescriptionHelper } from '../util/dom-description-helper';

export interface TableHeadRowsProps<D> {
    tableDescription: TableDescription<D>;
    onDOMDescription?: (headRowsDOMDescription: HeadRowDOMDescription[]) => void;
    tableHeadGroupRowComponent: React.ComponentType<Pick<TableHeadGroupRowProps<D>, Exclude<keyof TableHeadGroupRowProps<D>, TableHeadGroupRowProvidedProps>>>;
    tableHeadValueRowComponent: React.ComponentType<Pick<TableHeadValueRowProps<D>, Exclude<keyof TableHeadValueRowProps<D>, TableHeadValueRowProvidedProps>>>;
}

export type TableHeadRowsProvidedProps = 'tableHeadGroupRowComponent' | 'tableHeadValueRowComponent';

export class TableHeadRows<D> extends React.Component<TableHeadRowsProps<D>, never> {
    domDescriptionHelper = domDescriptionHelper<{ rows: HeadRowDOMDescription[] }>({
        rows: []
    }, (domDescription) => {
        if (this.props.onDOMDescription) {
            this.props.onDOMDescription(domDescription.rows);
        }
    });

    rows: HeadRowDOMDescription[] = [];

    shouldComponentUpdate(nextProps: TableHeadRowsProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return this.props.tableDescription.headRows.map((headRow, index) => {
            if (headRow.type === 'group-header-row') {
                return <this.props.tableHeadGroupRowComponent key={headRow.groupId} tableDescription={this.props.tableDescription} row={headRow} />;
            } else if (headRow.type === 'value-header-row') {
                return <this.props.tableHeadValueRowComponent key={`value-row-${index}`} tableDescription={this.props.tableDescription} row={headRow} />;
            } else {
                // TODO: investigate custom head rows
                // return <headRow.renderer tableDescription={this.props.tableDescription} />;
            }
        });
    }
}
