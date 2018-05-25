import * as React from 'react';

export interface TableRowProps {
}

export class TableRow extends React.Component<TableRowProps, never> {
    render() {
        return <tr children={this.props.children} />;
    }
}
