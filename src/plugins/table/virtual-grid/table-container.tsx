import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { TableDescription } from '../../../table/model';
import { TableHeadRowsProps, TableHeadRowsProvidedProps } from '../../../table/table-head-rows';
import { TableBodyRowsProps, TableBodyRowsProvidedProps } from './table-body-rows';

export interface TableContainerProps<D> {
    rowHeight: number;
    overscan: number;
    tableDescription: TableDescription<D>;
    tableHeadRowsComponent: React.ComponentType<Pick<TableHeadRowsProps<D>, Exclude<keyof TableHeadRowsProps<D>, TableHeadRowsProvidedProps>>>;
    tableBodyRowsComponent: React.ComponentType<Pick<TableBodyRowsProps<D>, Exclude<keyof TableBodyRowsProps<D>, TableBodyRowsProvidedProps>>>;
}

export type TableContainerProvidedProps = 'tableHeadRowsComponent' | 'tableBodyRowsComponent';

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

    container: HTMLDivElement | null = null;

    head: HTMLDivElement | null = null;

    raf: number | undefined = undefined;

    shouldComponentUpdate(nextProps: TableContainerProps<D>, nextState: TableContainerState) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }

    componentDidMount() {
        this.raf = window.requestAnimationFrame(this.update);
    }

    componentWillUnmount() {
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

    renderHead() {
        return <div style={{ display: 'grid', position: 'absolute', width: '100%', gridAutoRows: this.props.rowHeight, gridTemplateColumns: `repeat(${this.props.tableDescription.columnCount}, ${1 / this.props.tableDescription.columnCount * 100}%)`, top: this.state.scrollTop, backgroundColor: 'white' }} ref={(ref) => this.head = ref}>
            <this.props.tableHeadRowsComponent tableDescription={this.props.tableDescription} />
        </div>;
    }

    renderBody() {
        if (this.state.containerHeight !== null && this.state.headHeight !== null) {
            const start = Math.max(0, Math.floor(this.state.scrollTop / this.props.rowHeight) - this.props.overscan);
            const end = Math.min(this.props.tableDescription.bodyRowCount, Math.ceil((this.state.scrollTop + this.state.containerHeight - this.state.headHeight) / this.props.rowHeight) + this.props.overscan);

            return <div style={{ display: 'grid', position: 'absolute', width: '100%', gridAutoRows: this.props.rowHeight, gridTemplateColumns: `repeat(${this.props.tableDescription.columnCount}, ${1 / this.props.tableDescription.columnCount * 100}%)`, top: this.state.headHeight + start * this.props.rowHeight }}>
                <this.props.tableBodyRowsComponent tableDescription={this.props.tableDescription} start={start} end={end} />
            </div>;
        }
    }

    render() {
        return <div ref={(ref) => this.container = ref} tabIndex={0} style={{ position: 'relative', overflowX: 'visible', overflowY: 'auto', height: 500, border: '1px solid black' }}>
            {this.renderSpanner()}
            {this.renderBody()}
            {this.renderHead()}
        </div>;
    }
}
