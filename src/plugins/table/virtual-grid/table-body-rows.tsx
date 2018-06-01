import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableBodyRowsProps } from '../../../table/table-body-rows';
import { VirtualScrollingState, Subscription } from './model';

export function tableBodyRowsFactory<D>(initialState: VirtualScrollingState, addListener: (listener: (state: VirtualScrollingState) => void) => Subscription) {
    return class TableBodyRows<D> extends React.Component<TableBodyRowsProps<D>, VirtualScrollingState> {
        state: VirtualScrollingState = initialState;

        subscription: Subscription | undefined = undefined;

        shouldComponentUpdate(nextProps: TableBodyRowsProps<D>, nextState: VirtualScrollingState) {
            return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
        }

        componentDidMount() {
            this.subscription = addListener((state) => this.setState(state));
        }

        componentWillUnmount() {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
        }

        renderRows(height: number, scrollTop: number) {
            const start = Math.max(0, Math.floor(scrollTop / this.state.rowHeight) - this.state.overscan);
            const end = Math.min(this.props.tableDescription.bodyRowCount, Math.ceil((scrollTop + height) / this.state.rowHeight) + this.state.overscan);

            return <div style={{ display: 'grid', width: '100%', position: 'absolute', top: start * this.state.rowHeight, gridTemplateColumns: `repeat(${this.props.tableDescription.columnCount}, ${1 / this.props.tableDescription.columnCount * 100}%)` }}>
                {this.props.tableDescription.bodyRows.slice(start, end).map((row, index) =>
                    <this.props.tableBodyRowComponent key={start + index}>
                        <this.props.tableBodyCellComponent
                            id={`body-row-${start + index}-head-column`}
                            row={row}
                            column={{ type: 'head-column' }}
                        >
                            {row.label}
                        </this.props.tableBodyCellComponent>
                        {row.cells.map((cell) => {
                            const id = `body-row-${start + index}-${cell.column.groupDescriptors.map((group) => `${group.groupId}-${group.groupIndex}`).join('-')}-value-${cell.column.valueDescription.id}`;
                            return <this.props.tableBodyCellComponent
                                key={id}
                                id={id}
                                row={row}
                                column={cell.column}
                            >
                                {cell.column.valueDescription.reducer(cell.data)}
                            </this.props.tableBodyCellComponent>;
                        })}
                    </this.props.tableBodyRowComponent>
                )}
            </div>;
        }

        render() {
            if (this.state.containerHeight !== null && this.state.containerScrollTop !== null) {
                return this.renderRows(this.state.containerHeight, this.state.containerScrollTop);
            } else {
                return null;
            }
        }
    };
}
