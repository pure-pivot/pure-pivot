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

export interface ValueHeaderRow {
    type: 'value-header-row';
    labels: string[];
}

export type HeadRow = GroupHeaderRow | ValueHeaderRow;

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
    headRows: HeadRow[];
    bodyRows: BodyRow<D>[];
}

export function isGroupHeaderRow(headRow: HeadRow): headRow is GroupHeaderRow {
    return headRow.type === 'group-header-row';
}

export function isValueHeaderRow(headRow: HeadRow): headRow is ValueHeaderRow {
    return headRow.type === 'value-header-row';
}
