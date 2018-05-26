import * as React from 'react';

/* tslint:disable-next-line:no-empty-interface */
export interface TableContainerProps {
}

export class TableContainer extends React.Component<TableContainerProps, never> {
    render() {
        return <table children={this.props.children} />;
    }
}
