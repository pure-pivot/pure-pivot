import * as React from 'react';
import { TableHeadRowsProps, TableHeadRowsProvidedProps } from './table-head-rows';
import { TableDescription, HeadDOMDescription } from './model';
import { domDescriptionHelper } from '../util/dom-description-helper';

export interface TableHeadProps<D> {
    tableDescription: TableDescription<D>;
    onDOMDescription?: (headDOMDescription: HeadDOMDescription) => void;
    tableHeadRowsComponent: React.ComponentType<Pick<TableHeadRowsProps<D>, Exclude<keyof TableHeadRowsProps<D>, TableHeadRowsProvidedProps>>>;
}

export type TableHeadProvidedProps = 'tableHeadRowsComponent';

export class TableHead<D> extends React.Component<TableHeadProps<D>, never> {
    domDescriptionHelper = domDescriptionHelper<HeadDOMDescription>({
        head: null,
        headRows: []
    }, (domDescription) => {
        if (this.props.onDOMDescription) {
            this.props.onDOMDescription(domDescription);
        }
    });

    render() {
        return <thead ref={(ref) => this.domDescriptionHelper('head', ref)}>
            <this.props.tableHeadRowsComponent tableDescription={this.props.tableDescription} onDOMDescription={(rows) => this.domDescriptionHelper('headRows', rows)} />
        </thead>;
    }
}
