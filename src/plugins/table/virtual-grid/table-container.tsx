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
    height: number | null;
}

export class TableContainer<D> extends React.Component<TableContainerProps<D>, TableContainerState> {
    state: TableContainerState = {
        scrollTop: 0,
        height: null
    };

    container: HTMLDivElement | null = null;

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
            if (this.state.height !== this.container.clientHeight) {
                this.setState({ height: this.container.clientHeight });
            }
        }
        this.raf = window.requestAnimationFrame(this.update);
    }

    renderHead() {
        return <div style={{ display: 'grid', width: '100%', position: 'absolute', gridAutoRows: this.props.rowHeight, gridTemplateColumns: `repeat(${this.props.tableDescription.columnCount}, ${1 / this.props.tableDescription.columnCount * 100}%)`, top: 0 }}>
            <this.props.tableHeadRowsComponent tableDescription={this.props.tableDescription} />
        </div>;
    }

    renderBody(height: number) {
        const start = Math.max(0, Math.floor(this.state.scrollTop / this.props.rowHeight) - this.props.overscan);
        const end = Math.min(this.props.tableDescription.bodyRowCount, Math.ceil((this.state.scrollTop + height) / this.props.rowHeight) + this.props.overscan);

        return <div style={{ display: 'grid', width: '100%', position: 'absolute', gridAutoRows: this.props.rowHeight, gridTemplateColumns: `repeat(${this.props.tableDescription.columnCount}, ${1 / this.props.tableDescription.columnCount * 100}%)`, top: start * this.props.rowHeight }}>
            <this.props.tableBodyRowsComponent tableDescription={this.props.tableDescription} start={start} end={end} />
        </div>;
    }

    render() {
        return <div ref={(ref) => this.container = ref} tabIndex={0} style={{ position: 'relative', overflowX: 'visible', overflowY: 'auto', height: 500, border: '1px solid black' }}>
            <div style={{ height: this.props.rowHeight * this.props.tableDescription.bodyRowCount }} />
            {/* {this.renderHead()} */}
            {this.state.height !== null && this.renderBody(this.state.height)}
        </div>;
    }
}
