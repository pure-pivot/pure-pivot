import * as React from 'react';

export interface TableHeadCellProps {
    scope: 'row' | 'col';
    colSpan: number;
}

export class TableHeadCell extends React.Component<TableHeadCellProps, never> {
    render() {
        return <th {...this.props} />;
    }
}
