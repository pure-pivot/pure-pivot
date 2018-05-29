import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Draggable } from 'react-managed-draggable/lib-es6';
import { TableHeadValueCellProps } from '../../../table/table-head-value-cell';
import { Sizes } from './model';

export interface ResizableHocState {
    resizing: number | null;
    size: number | undefined;
}

export const resizableHoc = (initialSizes: Sizes) => <P extends { id: string }>(Component: React.ComponentType<P>) =>
    class ResizableHoc extends React.Component<P, ResizableHocState> {
        state: ResizableHocState = {
            resizing: null,
            size: initialSizes[this.props.id]
        };

        container: HTMLDivElement | null = null;

        render() {
            const offset = this.state.resizing !== null ? this.state.resizing : 0;

            return <Component {...this.props}>
                <div ref={(ref) => this.container = ref} style={{ position: 'relative', width: this.state.size }}>
                    {this.props.children}
                    <Draggable
                        style={{ position: 'absolute', zIndex: 1, top: 0, bottom: 0, right: -10 - offset, width: 20, cursor: 'col-resize' }}
                        onDragStart={(event, dragInformation) => {
                            this.setState({ resizing: 0 });
                        }}
                        onDragMove={(event, dragInformation) => {
                            this.setState({ resizing: dragInformation.current.x - dragInformation.start.x });
                        }}
                        onDragEnd={() => {
                            if (typeof this.state.resizing === 'number' && this.container !== null) {
                                const width = this.container.getBoundingClientRect().width;
                                this.setState({ size: Math.max(0, width + this.state.resizing), resizing: null });
                            }
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 9, right: 9, backgroundColor: 'green' }} />
                    </Draggable>
                </div>
            </Component>;
        }
    };
