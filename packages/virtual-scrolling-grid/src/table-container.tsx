import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as shallowEqual from 'shallowequal';
import { TableDescription, HeadColumnDescriptor, DataColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';
import { getHeadValueRowCellId } from '@pure-pivot/core/lib/es6/util/id-helper';
import { isElement } from '@pure-pivot/core/lib/es6/util/assertion';
import { Sizes } from './model';
import { TableHeadProps, TableHeadProvidedProps } from './table-head';
import { TableBodyProps, TableBodyProvidedProps } from './table-body';

export interface TableContainerProps<D> {
    rowHeight: number;
    overscan: number;
    sizes: Sizes;
    tableDescription: TableDescription<D>;
    tableWrapperComponent: React.ReactType;
    tableHeadComponent: React.ComponentClass<Pick<TableHeadProps<D>, Exclude<keyof TableHeadProps<D>, TableHeadProvidedProps>>>;
    tableBodyComponent: React.ComponentType<Pick<TableBodyProps<D>, Exclude<keyof TableBodyProps<D>, TableBodyProvidedProps>>>;
}

export type TableContainerProvidedProps = 'tableWrapperComponent' | 'tableHeadComponent' | 'tableBodyComponent';

export interface TableContainerState {
    scrollTop: number;
    containerHeight: number | null;
    headHeight: number | null;
}

export class TableContainer<D> extends React.Component<TableContainerProps<D>, TableContainerState> {
    state: TableContainerState = {
        scrollTop: 0,
        containerHeight: null,
        headHeight: null
    };

    container: Element | null = null;

    head: Element | null = null;

    raf: number | undefined = undefined;

    shouldComponentUpdate(nextProps: TableContainerProps<D>, nextState: TableContainerState) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }

    componentDidMount() {
        this.updateContainer();
        this.raf = window.requestAnimationFrame(this.update);
    }

    componentDidUpdate() {
        this.updateContainer();
    }

    componentWillUnmount() {
        if (this.raf !== undefined) {
            window.cancelAnimationFrame(this.raf);
        }
    }

    updateContainer() {
        const node = ReactDOM.findDOMNode(this);
        if (node !== null && isElement(node)) {
            this.container = node;
        } else {
            this.container = null;
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
        if (this.head !== null) {
            const { height } = this.head.getBoundingClientRect();
            if (this.state.headHeight !== height) {
                this.setState({ headHeight: height });
            }
        }
        this.raf = window.requestAnimationFrame(this.update);
    }

    renderSpanner() {
        if (this.state.headHeight) {
            return <div style={{ height: this.state.headHeight + this.props.rowHeight * this.props.tableDescription.bodyRowCount }} />;
        }
    }

    renderHead(sizes: number[]) {
        return <this.props.tableHeadComponent
            ref={(ref) => {
                if (ref !== null) {
                    const node = ReactDOM.findDOMNode(ref);
                    if (node !== null && isElement(node)) {
                        this.head = node;
                    } else {
                        this.head = null;
                    }
                } else {
                    this.head = null;
                }
            }}
            scrollTop={this.state.scrollTop}
            sizes={sizes}
            tableDescription={this.props.tableDescription}
        />;
    }

    renderBody(sizes: number[]) {
        if (this.state.containerHeight !== null && this.state.headHeight !== null) {
            const start = Math.max(0, Math.floor(this.state.scrollTop / this.props.rowHeight) - this.props.overscan);
            const end = Math.min(this.props.tableDescription.bodyRowCount, Math.ceil((this.state.scrollTop + this.state.containerHeight - this.state.headHeight) / this.props.rowHeight) + this.props.overscan);
            return <this.props.tableBodyComponent
                rowHeight={this.props.rowHeight}
                scrollTop={this.state.scrollTop}
                sizes={sizes}
                tableDescription={this.props.tableDescription}
                headHeight={this.state.headHeight}
                start={start}
                end={end}
            />;
        }
    }

    render() {
        const columns: (HeadColumnDescriptor | DataColumnDescriptor<D, {}>)[] = [{ type: 'head-column' }, ...this.props.tableDescription.headValueRow.columns];
        const sizes = columns.map(getHeadValueRowCellId).map((id) => this.props.sizes[id] === undefined ? 1 / columns.length : this.props.sizes[id]);

        return <this.props.tableWrapperComponent>
            {this.renderSpanner()}
            {this.renderBody(sizes)}
            {this.renderHead(sizes)}
        </this.props.tableWrapperComponent>;
    }
}
