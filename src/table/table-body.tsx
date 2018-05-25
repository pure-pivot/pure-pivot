import * as React from 'react';

export interface TableBodyProps {
    numDataColumns: number;
}

export class TableBody extends React.Component<TableBodyProps, never> {
    render() {
        return <tbody children={this.props.children} />;
    }
}
