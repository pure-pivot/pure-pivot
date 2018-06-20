import * as React from 'react';
import { DataColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';
import { SortingDescriptor } from './model';

export interface ToggleComponentProps {
    column: DataColumnDescriptor<any, any>;
    activeSorting: SortingDescriptor | null;
    onSetActiveSorting: (sorting: SortingDescriptor | null) => void;
}

// .withAutoSorter({
//     valueId: 'sum-duration',
//     groupDescriptors: [{
//         groupId: 'pure-pivot-default-group',
//         groupIndex: 0
//     }],
//     order: 'descending'
// })

export class ToggleComponent extends React.Component<ToggleComponentProps, never> {
    renderInactive() {
        return <span style={{ cursor: 'pointer' }} onClick={() => this.props.onSetActiveSorting({ valueId: this.props.column.valueDescription.id, groupDescriptors: this.props.column.groupDescriptors, order: 'ascending' })}>
            ▬
        </span>;
    }

    renderAscending() {
        return <span style={{ cursor: 'pointer' }} onClick={() => this.props.onSetActiveSorting({ valueId: this.props.column.valueDescription.id, groupDescriptors: this.props.column.groupDescriptors, order: 'descending' })}>
            ▲
        </span>;
    }

    renderDescending() {
        return <span style={{ cursor: 'pointer' }} onClick={() => this.props.onSetActiveSorting(null)}>
            ▼
        </span>;
    }

    render() {
        if (this.props.activeSorting !== null && this.props.activeSorting.valueId === this.props.column.valueDescription.id && this.props.activeSorting.groupDescriptors.every((group, index) => group.groupId === this.props.column.groupDescriptors[index].groupId && group.groupIndex === this.props.column.groupDescriptors[index].groupIndex)) {
            if (this.props.activeSorting.order === 'ascending') {
                return this.renderAscending();
            } else {
                return this.renderDescending();
            }
        } else {
            return this.renderInactive();
        }
    }
}
