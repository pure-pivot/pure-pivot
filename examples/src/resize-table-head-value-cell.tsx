import * as React from 'react';
import { Draggable } from 'react-managed-draggable/lib-es6';
import { TableHeadValueCellProps } from '../../lib/es6/table/table-head-value-cell';
import { Data } from './app';

export interface ResizeTableHeadValueCellState {
    resizing: { colStart: number, offset: number } | null;
}

export function resizeTableHeadValueComponentFactory(defaultSizes: number[]) {
    return class ResizeTableHeadValueCellComponent extends React.Component<TableHeadValueCellProps<Data>, ResizeTableHeadValueCellState> {
        state: ResizeTableHeadValueCellState = {
            resizing: null
        };

        render() {
            // console.log(this.props);
            const offset = this.state.resizing !== null && this.state.resizing.colStart === this.props.colStart ? this.state.resizing.offset : 0;
            return <th scope={this.props.scope} style={{ position: 'relative' }}>
                {this.props.children}
                {this.props.colStart !== 0 &&
                    <Draggable
                        style={{ position: 'absolute', zIndex: 1, top: 0, bottom: 0, left: -4 + offset, width: 8, cursor: 'col-resize' }}
                        onDragStart={(event, dragInformation) => {
                            this.setState({ resizing: { colStart: this.props.colStart, offset: 0 } });
                        }}
                        onDragMove={(event, dragInformation) => {
                            this.setState({ resizing: { colStart: this.props.colStart, offset: dragInformation.current.x - dragInformation.start.x } });
                        }}
                        onDragEnd={() => {
                            this.setState({ resizing: null });
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 3, right: 3, backgroundColor: 'green' }} />
                    </Draggable>
                }
            </th>;
        }
    };
}
