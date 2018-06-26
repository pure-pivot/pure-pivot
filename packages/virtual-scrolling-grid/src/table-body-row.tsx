import * as React from 'react';
import { BodyRow } from '@pure-pivot/core/lib/es6/table/model';

export interface TableBodyRowProps<D> {
    row: BodyRow<D>;
}

export class TableBodyRow<D> extends React.Component<TableBodyRowProps<D>, never> {
    render() {
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }
}
