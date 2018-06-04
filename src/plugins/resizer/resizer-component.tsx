import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { Draggable } from 'react-managed-draggable';
import { TableDescription } from '../../table/model';

export interface ResizerProps {
    defaultSizes?: number[];
    onSizesChange: (sizes: number[]) => void;
    tableElement: Element;
    tableDescription: TableDescription<any>;
}

export interface ResizerState {
    containerLeft: number | null;
    containerTop: number | null;
    tableLeft: number | null;
    tableTop: number | null;
    tableInnerTop: number | null;
    tableInnerLeft: number | null;
    tableInnerWidth: number | null;
    tableInnerHeight: number | null;
}

export class Resizer extends React.Component<ResizerProps, ResizerState> {
    state: ResizerState = {
        containerTop: null,
        containerLeft: null,
        tableTop: null,
        tableLeft: null,
        tableInnerTop: null,
        tableInnerLeft: null,
        tableInnerWidth: null,
        tableInnerHeight: null
    };

    raf: number | undefined = undefined;

    container: HTMLDivElement | null = null;

    shouldComponentUpdate(nextProps: ResizerProps, nextState: ResizerState) {
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
            const { top, left } = this.container.getBoundingClientRect();
            if (this.state.containerTop !== top || this.state.containerLeft !== left) {
                this.setState({ containerTop: top, containerLeft: left });
            }
        }
        const { top, left, width, height } = this.props.tableElement.getBoundingClientRect();
        if (this.state.tableLeft !== left || this.state.tableTop !== top) {
            this.setState({ tableTop: top, tableLeft: left });
        }
        const paddingTop = parseFloat(window.getComputedStyle(this.props.tableElement, null).getPropertyValue('padding-top'));
        const paddingLeft = parseFloat(window.getComputedStyle(this.props.tableElement, null).getPropertyValue('padding-left'));
        // TODO: subtract padding from tableInnerX (top, left, width, height)
        if (this.state.tableInnerTop !== this.props.tableElement.clientTop || this.state.tableInnerLeft !== this.props.tableElement.clientLeft) {
            this.setState({ tableInnerTop: this.props.tableElement.clientTop, tableInnerLeft: this.props.tableElement.clientLeft });
        }
        if (this.state.tableInnerWidth !== this.props.tableElement.clientWidth || this.state.tableInnerHeight !== this.props.tableElement.clientHeight) {
            this.setState({ tableInnerWidth: this.props.tableElement.clientWidth, tableInnerHeight: this.props.tableElement.clientHeight });
        }
        this.raf = window.requestAnimationFrame(this.update);
    }

    renderHandles() {
        if (this.state.containerTop !== null && this.state.containerLeft !== null && this.state.tableTop !== null && this.state.tableLeft !== null && this.state.tableInnerTop !== null && this.state.tableInnerLeft !== null && this.state.tableInnerWidth !== null && this.state.tableInnerHeight !== null) {
            const offsetTop = this.state.tableTop - this.state.containerTop + this.state.tableInnerTop;
            const offsetLeft = this.state.tableLeft - this.state.containerLeft + this.state.tableInnerLeft;

            const step = 1 / this.props.tableDescription.columnCount;

            const result: React.ReactNode[] = [];
            for (let i = 1; i < this.props.tableDescription.columnCount; i++) {
                result.push(<div style={{
                    position: 'absolute',
                    cursor: 'col-resize',
                    top: offsetTop,
                    left: offsetLeft + i * step * this.state.tableInnerWidth,
                    width: 20,
                    height: this.state.tableInnerHeight,
                    backgroundColor: 'red'
                }} />);
            }

            return result;
        }
    }

    render() {
        return <div ref={(ref) => this.container = ref} style={{ position: 'relative' }}>
            {this.renderHandles()}
        </div>;
    }
}
