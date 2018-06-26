import * as React from 'react';
import { TableBodyRowProps } from '@pure-pivot/default-table/lib/es6/table-body-row';

export class TableBodyRow<D> extends React.Component<TableBodyRowProps<D>, never> {
    render() {
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }
}
