import * as React from 'react';

export interface PaginationProps {
    offset: number;
    limit: number;
    onOffsetChange: (offset: number) => void;
}

export function paginationFactory(pushPaginationChange: (offset: number, limit: number) => void) {
    return class Pagination extends React.Component<PaginationProps, never> {
        constructor(props: PaginationProps) {
            super(props);
            pushPaginationChange(props.offset, props.limit);
        }

        componentWillReceiveProps(nextProps: PaginationProps) {
            if (this.props.offset !== nextProps.offset || this.props.limit !== nextProps.limit) {
                pushPaginationChange(nextProps.offset, nextProps.limit);
            }
        }

        render() {
            return <React.Fragment>
                <button onClick={() => this.props.onOffsetChange(this.props.offset - this.props.limit)}>Previous</button>
                {this.props.offset} - {this.props.offset + this.props.limit}
                <button onClick={() => this.props.onOffsetChange(this.props.offset + this.props.limit)}>Next</button>
            </React.Fragment>;
        }
    };
}
