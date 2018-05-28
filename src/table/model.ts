import { ValueReducers } from '../values/model';

export interface GroupHeaderRowGroup {
    label: string;
    subColumnSize: number;
}

export interface GroupHeaderRow {
    type: 'group-header-row';
    level: number;
    label: string;
    groups: GroupHeaderRowGroup[];
}

export interface GroupDescriptor {
    groupId: string;
    groupIndex: number;
}

export interface ValueHeaderRowValue {
    groupsDescriptors: GroupDescriptor[];
    valueId: string;
    label: string;
}

export interface ValueHeaderRow {
    type: 'value-header-row';
    values: ValueHeaderRowValue[];
}

// export interface CustomHeaderRowRendererProps<D> {
//     tableDescription: TableDescription<D>;
//     tableHeadRowComponent: React.ReactType;
//     tableHeadCellComponent: React.ComponentType<TableHeadCellProps>;
// }

// export interface CustomHeaderRow<D> {
//     type: 'custom-header-row';
//     renderer: React.ComponentType<CustomHeaderRowRendererProps<D>>;
// }

export type HeadRow<D> = GroupHeaderRow | ValueHeaderRow; // | CustomHeaderRow<D>;

export interface BodyRow<D> {
    type: 'body-row';
    level: number;
    label: string;
    data: D[][];
}

export interface TableDescription<D> {
    headColumnCount: number;
    bodyColumnCount: number;
    columnCount: number;
    headRowCount: number;
    bodyRowCount: number;
    rowCount: number;
    valueCount: number;
    values: ValueReducers<D>;
    headRows: HeadRow<D>[];
    bodyRows: BodyRow<D>[];
}

export function isGroupHeaderRow(headRow: HeadRow<any>): headRow is GroupHeaderRow {
    return headRow.type === 'group-header-row';
}

export function isValueHeaderRow(headRow: HeadRow<any>): headRow is ValueHeaderRow {
    return headRow.type === 'value-header-row';
}
