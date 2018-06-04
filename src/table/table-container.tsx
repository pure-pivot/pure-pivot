import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableDescription, TableDOMDescription } from './model';
import { TableHeadProps, TableHeadProvidedProps } from './table-head';
import { TableBodyProps, TableBodyProvidedProps } from './table-body';
import { domDescriptionHelper } from '../util/dom-description-helper';

export interface TableContainerProps<D> {
    tableDescription: TableDescription<D>;
    onDOMDescription?: (tableDOMDescription: TableDOMDescription) => void;
    tableHeadComponent: React.ComponentType<Pick<TableHeadProps<D>, Exclude<keyof TableHeadProps<D>, TableHeadProvidedProps>>>;
    tableBodyComponent: React.ComponentType<Pick<TableBodyProps<D>, Exclude<keyof TableBodyProps<D>, TableBodyProvidedProps>>>;
}

export type TableContainerProvidedProps = 'tableHeadComponent' | 'tableBodyComponent';

export class TableContainer<D> extends React.Component<TableContainerProps<D>, never> {
    domDescriptionHelper = domDescriptionHelper<TableDOMDescription>({
        container: null,
        head: null,
        body: null
    }, (domDescription) => {
        if (this.props.onDOMDescription) {
            this.props.onDOMDescription(domDescription);
        }
    });

    shouldComponentUpdate(nextProps: TableContainerProps<D>) {
        return !shallowEqual(this.props, nextProps);
    }

    render() {
        return <table ref={(ref) => this.domDescriptionHelper('container', ref)}>
            <this.props.tableHeadComponent tableDescription={this.props.tableDescription} onDOMDescription={(head) => this.domDescriptionHelper('head', head)} />
            <this.props.tableBodyComponent tableDescription={this.props.tableDescription} />
        </table>;
    }
}
