import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableContainerProps } from '../../../table/table-container';
import { VirtualScrollingState, Subscription } from './model';

export interface VirtualTableContainerProps<D> extends Pick<TableContainerProps<D>, Exclude<keyof TableContainerProps<D>, 'tableHeadComponent' | 'tableBodyComponent'>> {
    tableHeadComponent: React.ComponentType<Pick<VirtualTableHeadProps<D>, Exclude<keyof TableHeadProps<D>, TableHeadProvidedProps>>>;
    tableBodyComponent: React.ComponentType<Pick<VirtualTableBodyProps<D>, Exclude<keyof TableBodyProps<D>, TableBodyProvidedProps>>>;
}

export interface TableContainerState extends VirtualScrollingState {
    scrollTop: number;
    containerHeight: number | null;
    headHeight: number | null;
}

export function tableContainerFactory<D>(initialState: VirtualScrollingState, addListener: (listener: (state: VirtualScrollingState) => void) => Subscription) {
    return class TableContainer<D> extends React.Component<TableContainerProps<D>, TableContainerState> {
        state: TableContainerState = {
            ...initialState,
            scrollTop: 0,
            containerHeight: null,
            headHeight: null
        };

        subscription: Subscription | undefined = undefined;

        container: HTMLDivElement | null = null;

        raf: number | undefined = undefined;

        shouldComponentUpdate(nextProps: TableContainerProps<D>, nextState: TableContainerState) {
            return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
        }

        componentDidMount() {
            this.subscription = addListener((state) => this.setState(state));
            this.raf = window.requestAnimationFrame(this.update);
        }

        componentWillUnmount() {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            if (this.raf !== undefined) {
                window.cancelAnimationFrame(this.raf);
            }
        }

        update = () => {
            if (this.container !== null) {
                if (this.state.scrollTop !== this.container.scrollTop) {
                    this.setState({ scrollTop: this.container.scrollTop });
                }
                if (this.state.containerHeight !== this.container.clientHeight) {
                    this.setState({ containerHeight: this.container.clientHeight });
                }
            }
            this.raf = window.requestAnimationFrame(this.update);
        }

        render() {
            return <div ref={(ref) => this.container = ref} tabIndex={0} style={{ position: 'relative', overflowX: 'visible', overflowY: 'auto', height: 500, border: '1px solid black' }}>
                <div style={{ height: this.state.rowHeight * this.props.tableDescription.bodyRowCount }} />
                <this.props.tableHeadComponent tableDescription={this.props.tableDescription} onHeightChange={(height) => this.setState({ headHeight: height })} />
                <this.props.tableBodyComponent tableDescription={this.props.tableDescription} containerHeight={this.state.height} />
            </div>;
        }
    };
}
