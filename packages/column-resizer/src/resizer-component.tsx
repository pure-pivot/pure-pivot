import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { Draggable, DraggableProps } from 'react-managed-draggable';
import { TableDescription, DataColumnDescriptor, HeadColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';
import { Sizes } from './model';
import { getHeadValueRowCellId } from '@pure-pivot/core/lib/es6/util/id-helper';
import { clamp } from '@pure-pivot/core/lib/es6/util/math';

export interface ResizerProps {
    sizes: Sizes;
    dragHandleWidth: number;
    dragHandleComponent?: React.ReactType;
    draggableProps?: Pick<DraggableProps, Exclude<keyof DraggableProps, 'onDragStart' | 'onDragMove' | 'onDragEnd'>>;
    minimumSize: number;
    onSizesChange: (sizes: Sizes) => void;
    onSizesChangeEnd: (sizes: Sizes) => void;
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
        tableInnerWidth: null,
        tableInnerHeight: null,
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
        if (this.state.tableInnerWidth !== this.props.tableElement.clientWidth || this.state.tableInnerHeight !== this.props.tableElement.clientHeight) {
            this.setState({ tableInnerWidth: this.props.tableElement.clientWidth, tableInnerHeight: this.props.tableElement.clientHeight });
        }
        this.raf = window.requestAnimationFrame(this.update);
    }

    renderHandles(ids: string[], sizes: number[]) {
        if (this.state.containerTop !== null && this.state.containerLeft !== null && this.state.tableTop !== null && this.state.tableLeft !== null && this.state.tableInnerTop !== null && this.state.tableInnerLeft !== null && this.state.tableInnerWidth !== null && this.state.tableInnerHeight !== null) {
            const offsetTop = this.state.tableTop - this.state.containerTop + this.state.tableInnerTop;
            const offsetLeft = this.state.tableLeft - this.state.containerLeft + this.state.tableInnerLeft;
            const style = this.props.draggableProps && this.props.draggableProps.style;

            const result: React.ReactNode[] = [];
            for (let i = 0, size = sizes[0]; i < ids.length - 1; i++ , size += sizes[i]) {
                result.push(
                    <Draggable
                        key={ids[i]}
                        {...this.props.draggableProps}
                        style={{
                            ...style,
                            position: 'absolute',
                            cursor: 'col-resize',
                            top: offsetTop,
                            left: offsetLeft + size * this.state.tableInnerWidth - this.props.dragHandleWidth / 2,
                            width: this.props.dragHandleWidth,
                            height: this.state.tableInnerHeight
                        }}
                        onDragStart={() => this.setState({ draggingId: ids[i], draggingStartSizes: [sizes[i], sizes[i + 1]] })}
                        onDragMove={(event, payload) => {
                            this.props.onSizesChange({
                                ...this.props.sizes,
                                [ids[i]]: sizes[i],
                                [ids[i + 1]]: sizes[i + 1]
                            });
                            this.setState({ draggingOffset: payload.current.x - payload.start.x });
                        }}
                        onDragEnd={(event, payload) => {
                            if (this.state.tableInnerWidth !== null) {
                                this.adjustSizes(sizes, i, (payload.current.x - payload.start.x) / this.state.tableInnerWidth);
                                this.props.onSizesChangeEnd({
                                    ...this.props.sizes,
                                    [ids[i]]: sizes[i],
                                    [ids[i + 1]]: sizes[i + 1]
                                });
                                this.setState({ draggingId: null, draggingOffset: 0 });
                            }
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
        const clamped = clamp(
            delta,
            this.props.minimumSize - this.state.draggingStartSizes[0],
            this.state.draggingStartSizes[1] - this.props.minimumSize
        );
        sizes[index] = this.state.draggingStartSizes[0] + clamped;
        sizes[index + 1] = this.state.draggingStartSizes[1] - clamped;
    }

    render() {
        const ids = this.props.tableDescription.columns.map(getHeadValueRowCellId);
        const fractions = ids.map((id) => this.props.sizes[id] === undefined ? 1 / ids.length : this.props.sizes[id]);
        const sum = fractions.reduce((sum, fraction) => sum + fraction, 0);
        const normalized = fractions.map((fraction) => fraction / sum);

        if (this.state.draggingId !== null && this.state.tableInnerWidth !== null) {
            const index = ids.indexOf(this.state.draggingId);
            const delta = this.state.draggingOffset / this.state.tableInnerWidth;
            this.adjustSizes(normalized, index, delta);
        }

        return <div ref={(ref) => this.container = ref} style={{ position: 'relative' }}>
            {this.renderHandles(ids, normalized)}
        </div>;
    }
}
