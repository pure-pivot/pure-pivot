import { ValueReducers } from '../values/model';

export interface GroupColumnDescriptor {
    type: 'group-column';
    label: string;
    subColumnSize: number;
    groupDescriptors: GroupDescriptor[];
}

export interface GroupHeaderRow {
    type: 'group-header-row';
    level: number;
    groupId: string;
    groupLabel: string;
    groups: GroupColumnDescriptor[];
}

export interface GroupDescriptor {
    groupId: string;
    groupIndex: number;
}

export interface DataColumnDescriptor {
    type: 'data-column';
    groupDescriptors: GroupDescriptor[];
    valueId: string;
    label: string;
}

export interface HeadColumnDescriptor {
    type: 'head-column';
}

export type ColumnDescriptor = DataColumnDescriptor | HeadColumnDescriptor | GroupColumnDescriptor;

export interface ValueHeaderRow {
    type: 'value-header-row';
    columns: DataColumnDescriptor[];
}

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
