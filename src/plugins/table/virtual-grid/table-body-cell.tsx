import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyCellProps } from '../../../table/table-body-cell';
import { VirtualScrollingState, Subscription } from './model';

export type TableBodyCellState = Pick<VirtualScrollingState, 'rowHeight'>;

export function tableBodyCellFactory<D>(initialState: VirtualScrollingState, addListener: (listener: (state: VirtualScrollingState) => void) => Subscription) {
    return class TableBodyCell<D> extends React.Component<TableBodyCellProps<D>, TableBodyCellState> {
        state: TableBodyCellState = {
            rowHeight: initialState.rowHeight
        };

        subscription: Subscription | undefined = undefined;

        shouldComponentUpdate(nextProps: TableBodyCellProps<D>, nextState: TableBodyCellState) {
            return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
        }

        componentDidMount() {
            // Pushes stuff to array alot during scrolling
            this.subscription = addListener((state) => this.setState(state));
        }

        componentWillUnmount() {
            if (this.subscription) {
                // Splices array alot during scrolling
                this.subscription.unsubscribe();
            }
        }

        render() {
            return <div style={{ height: this.state.rowHeight, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxSizing: 'border-box' }}>
                {this.props.column.type === 'head-column' ? '+'.repeat(this.props.row.level) : null} {this.props.children}
            </div>;
        }
    };
}
