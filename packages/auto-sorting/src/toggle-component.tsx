import * as React from 'react';
import { DataColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';
import { SortingDescriptor } from './model';

export interface SubComponentProps {
    onToggle: () => void;
}

export interface ToggleComponentProps {
    column: DataColumnDescriptor<any, any>;
    activeSorting: SortingDescriptor | null;
    onSetActiveSorting: (sorting: SortingDescriptor | null) => void;
    inactiveComponent?: React.ComponentType<SubComponentProps>;
    ascendingComponent?: React.ComponentType<SubComponentProps>;
    descendingComponent?: React.ComponentType<SubComponentProps>;
}

export function DefaultAscendingComponent(props: SubComponentProps) {
    return <button onClick={props.onToggle}>▲</button>;
}

export function DefaultDescendingComponent(props: SubComponentProps) {
    return <button onClick={props.onToggle}>▼</button>;
}

export function DefaultInactiveComponent(props: SubComponentProps) {
    return <button onClick={props.onToggle}>▬</button>;
}

export function ToggleComponent(props: ToggleComponentProps) {
    const AscendingComponent = props.ascendingComponent || DefaultAscendingComponent;
    const DescendingComponent = props.descendingComponent || DefaultDescendingComponent;
    const InactiveComponent = props.inactiveComponent || DefaultInactiveComponent;

    if (props.activeSorting !== null && props.activeSorting.valueId === props.column.valueDescription.id && props.activeSorting.groupDescriptors.every((group, index) => group.groupId === props.column.groupDescriptors[index].groupId && group.groupIndex === props.column.groupDescriptors[index].groupIndex)) {
        if (props.activeSorting.order === 'ascending') {
            return <AscendingComponent onToggle={() => props.onSetActiveSorting({ valueId: props.column.valueDescription.id, groupDescriptors: props.column.groupDescriptors, order: 'descending' })} />;
        } else {
            return <DescendingComponent onToggle={() => props.onSetActiveSorting(null)} />;
        }
    } else {
        return <InactiveComponent onToggle={() => props.onSetActiveSorting({ valueId: props.column.valueDescription.id, groupDescriptors: props.column.groupDescriptors, order: 'ascending' })} />;
    }
}
