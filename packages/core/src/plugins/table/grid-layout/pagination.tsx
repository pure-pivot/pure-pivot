import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableDescription } from '../../../table/model';

export interface PaginationProps {
    offset: number;
    limit: number;
    tableDescription: TableDescription<any>;
    onOffsetChange: (offset: number) => void;
}

export function paginationFactory(pushPaginationChange: (offset: number, limit: number) => void) {
    return class Pagination extends React.Component<PaginationProps, never> {
        constructor(props: PaginationProps) {
            super(props);
            pushPaginationChange(props.offset, props.limit);
        }

        shouldComponentUpdate(nextProps: PaginationProps) {
            return !shallowEqual(this.props, nextProps);
        }

        componentWillReceiveProps(nextProps: PaginationProps) {
            if (this.props.offset !== nextProps.offset || this.props.limit !== nextProps.limit) {
                pushPaginationChange(nextProps.offset, nextProps.limit);
            }
        }

        render() {
            return <React.Fragment>
                <button
                    onClick={() => this.props.onOffsetChange(0)}
                    disabled={this.props.offset <= 0}
                >
                    Start
                </button>
                <button
                    onClick={() => this.props.onOffsetChange(this.props.offset - this.props.limit)}
                    disabled={this.props.offset <= 0}
                >
                    Previous
                </button>
                {this.props.offset} - {this.props.offset + this.props.limit}
                <button
                    onClick={() => this.props.onOffsetChange(this.props.offset + this.props.limit)}
                    disabled={this.props.offset + this.props.limit >= this.props.tableDescription.bodyRowCount}
                >
                    Next
                </button>
                <button
                    onClick={() => this.props.onOffsetChange(Math.floor(this.props.tableDescription.bodyRowCount / this.props.limit) * this.props.limit)}
                    disabled={this.props.offset + this.props.limit >= this.props.tableDescription.bodyRowCount}
                >
                    End
                </button>
            </React.Fragment>;
        }
    };
}
