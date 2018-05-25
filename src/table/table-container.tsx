import * as React from 'react';

export interface TableContainerProps {
    numGroupHeaderRows: number;
    numDataColumns: number;
}

export class TableContainer extends React.Component<TableContainerProps, never> {
    render() {
        return <table children={this.props.children} />;
    }
}
