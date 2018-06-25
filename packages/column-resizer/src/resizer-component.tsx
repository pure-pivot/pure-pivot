import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { Draggable, DraggableProps } from 'react-managed-draggable';
import { TableDescription } from '@pure-pivot/core/lib/es6/table/model';
import { Sizes } from './model';
import { getHeadValueRowCellId } from '@pure-pivot/core/lib/es6/util/id-helper';
import { clamp } from '@pure-pivot/core/lib/es6/util/math';

export interface ResizerProps {
    columnWidths: Sizes;
    defaultColumnWidth: number;
    dragHandleWidth: number;
    dragHandleComponent?: React.ReactType;
    draggableProps?: Pick<DraggableProps, Exclude<keyof DraggableProps, 'onDragStart' | 'onDragMove' | 'onDragEnd'>>;
    minimumColumnWidth: number;
    onWidthsChange: (sizes: Sizes) => void;
    onWidthsChangeEnd: (sizes: Sizes) => void;
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
    tableInnerHeight: number | null;
    tableScrollLeft: number | null;
    draggingId: string | null;
    draggingOffset: number;
    draggingStartSizes: [number, number];
}

export class Resizer extends React.Component<ResizerProps, ResizerState> {
    state: ResizerState = {
        containerTop: null,
        containerLeft: null,
        tableTop: null,
        tableLeft: null,
        tableInnerTop: null,
        tableInnerLeft: null,
        tableInnerHeight: null,
        tableScrollLeft: null,
        draggingId: null,
        draggingOffset: 0,
        draggingStartSizes: [0, 0]
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
        const { top, left } = this.props.tableElement.getBoundingClientRect();
        if (this.state.tableLeft !== left || this.state.tableTop !== top) {
            this.setState({ tableTop: top, tableLeft: left });
        }
        if (this.state.tableInnerTop !== this.props.tableElement.clientTop || this.state.tableInnerLeft !== this.props.tableElement.clientLeft) {
            this.setState({ tableInnerTop: this.props.tableElement.clientTop, tableInnerLeft: this.props.tableElement.clientLeft });
        }
        if (this.state.tableInnerHeight !== this.props.tableElement.clientHeight) {
            this.setState({ tableInnerHeight: this.props.tableElement.clientHeight });
        }
        if (this.state.tableScrollLeft !== this.props.tableElement.scrollLeft) {
            this.setState({ tableScrollLeft: this.props.tableElement.scrollLeft });
        }
        this.raf = window.requestAnimationFrame(this.update);
    }

    renderHandles(ids: string[], sizes: number[]) {
        if (this.state.containerTop !== null && this.state.containerLeft !== null && this.state.tableTop !== null && this.state.tableLeft !== null && this.state.tableInnerTop !== null && this.state.tableInnerLeft !== null && this.state.tableInnerHeight !== null && this.state.tableScrollLeft !== null) {
            const offsetTop = this.state.tableTop - this.state.containerTop + this.state.tableInnerTop;
            const offsetLeft = this.state.tableLeft - this.state.containerLeft + this.state.tableInnerLeft - this.state.tableScrollLeft;
            const style = this.props.draggableProps && this.props.draggableProps.style;

            const result: React.ReactNode[] = [];
            for (let i = 0, size = sizes[0]; i < ids.length; i++ , size += sizes[i]) {
                result.push(
                    <Draggable
                        key={ids[i]}
                        {...this.props.draggableProps}
                        style={{
                            ...style,
                            position: 'absolute',
                            cursor: 'col-resize',
                            top: offsetTop,
                            left: offsetLeft + size - this.props.dragHandleWidth / 2,
                            width: this.props.dragHandleWidth,
                            height: this.state.tableInnerHeight
                        }}
                        onDragStart={() => this.setState({ draggingId: ids[i], draggingStartSizes: [sizes[i], sizes[i + 1]] })}
                        onDragMove={(event, payload) => {
                            const newWidths = { ...this.props.columnWidths };
                            newWidths[ids[i]] = sizes[i];
                            if (i < ids.length - 1) {
                                newWidths[ids[i + 1]] = sizes[i + 1];
                            }
                            this.props.onWidthsChange(newWidths);
                            this.setState({ draggingOffset: payload.current.x - payload.start.x });
                        }}
                        onDragEnd={(event, payload) => {
                            this.adjustSizes(sizes, i, payload.current.x - payload.start.x);
                            const newWidths = { ...this.props.columnWidths };
                            newWidths[ids[i]] = sizes[i];
                            if (i < ids.length - 1) {
                                newWidths[ids[i + 1]] = sizes[i + 1];
                            }
                            this.props.onWidthsChangeEnd(newWidths);
                            this.setState({ draggingId: null, draggingOffset: 0 });
                        }}
                    >
                        {this.props.dragHandleComponent !== undefined && <this.props.dragHandleComponent />}
                    </Draggable>
                );
            }

            return result;
        }
    }

    adjustSizes(sizes: number[], index: number, delta: number) {
        if (index < sizes.length - 1) {
            const clamped = clamp(
                delta,
                this.props.minimumColumnWidth - this.state.draggingStartSizes[0],
                this.state.draggingStartSizes[1] - this.props.minimumColumnWidth
            );
            sizes[index] = this.state.draggingStartSizes[0] + clamped;
            sizes[index + 1] = this.state.draggingStartSizes[1] - clamped;
        } else {
            sizes[index] = this.state.draggingStartSizes[0] + delta;
        }
    }

    render() {
        const ids = this.props.tableDescription.columns.map(getHeadValueRowCellId);
        const sizes = ids.map((id) => this.props.columnWidths[id] === undefined ? this.props.defaultColumnWidth : this.props.columnWidths[id]);

        if (this.state.draggingId !== null) {
            const index = ids.indexOf(this.state.draggingId);
            const delta = this.state.draggingOffset;
            this.adjustSizes(sizes, index, delta);
        }

        return <div ref={(ref) => this.container = ref} style={{ position: 'relative' }}>
            {this.renderHandles(ids, sizes)}
        </div>;
    }
}
