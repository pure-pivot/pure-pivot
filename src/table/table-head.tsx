import * as React from 'react';

export interface TableHeadProps {
    numGroupHeaderRows: number;
    numDataColumns: number;
}

export class TableHead extends React.Component<TableHeadProps, never> {
    render() {
        return <thead children={this.props.children} />;
    }
}
