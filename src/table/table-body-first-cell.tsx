import * as React from 'react';

export interface TableBodyFirstCellProps {
    level: number;
}

export class TableBodyFirstCell extends React.Component<TableBodyFirstCellProps, never> {
    render() {
        return <th scope="row">
            {'+'.repeat(this.props.level)} {this.props.children}
        </th>;
    }
}
