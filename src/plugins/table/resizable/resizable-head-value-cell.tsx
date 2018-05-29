import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Draggable } from 'react-managed-draggable/lib-es6';
import { TableHeadValueCellProps } from '../../../table/table-head-value-cell';
import { Sizes } from './model';

export interface ResizableTableHeadValueCellState {
    resizing: number | null;
    size: number;
}

export const resizableHoc = (initialSizes: Sizes) => <P extends { id: string }>(Component: React.ComponentType<P>) =>
    class ResizableHoc extends React.Component<P, ResizableTableHeadValueCellState> {
        state: ResizableTableHeadValueCellState = {
            resizing: null,
            size: initialSizes[this.props.id]
        };

        render() {
            const offset = this.state.resizing !== null ? this.state.resizing : 0;

            return <Component {...this.props}>
                {this.props.children}
                <Draggable
                    style={{ position: 'absolute', zIndex: 1, top: 0, bottom: 0, left: offset - 10, width: 20, cursor: 'col-resize' }}
                    onDragStart={(event, dragInformation) => {
                        this.setState({ resizing: 0 });
                    }}
                    onDragMove={(event, dragInformation) => {
                        this.setState({ resizing: dragInformation.current.x - dragInformation.start.x });
                    }}
                    onDragEnd={() => {
                        if (typeof this.state.resizing === 'number') {
                            this.setState({ size: this.state.resizing, resizing: null });
                        }
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 9, right: 9, backgroundColor: 'green' }} />
                </Draggable>
            </Component>;
        }
    };
