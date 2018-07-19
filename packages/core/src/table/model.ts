import { ValueReducers, ValueReducerDescription } from '../values/model';

export interface GroupDescriptor {
    groupId: string;
    groupIndex: number;
}

export interface HeadColumnDescriptor {
    type: 'head-column';
    id: string;
}

export interface GroupColumnDescriptor {
    type: 'group-column';
    label: string;
    subColumnSize: number;
    groupDescriptors: GroupDescriptor[];
}

export interface DataColumnDescriptor<D, T> {
    type: 'data-column';
    valueDescription: ValueReducerDescription<D, T>;
    groupDescriptors: GroupDescriptor[];
}

export type ValueColumnDescriptor<D> = DataColumnDescriptor<D, {}> | HeadColumnDescriptor;

export type ColumnDescriptor<D> = ValueColumnDescriptor<D> | GroupColumnDescriptor;

export interface GroupHeaderRow {
    type: 'group-header-row';
    level: number;
    groupId: string;
    groupLabel: string;
    groups: GroupColumnDescriptor[];
}

export interface ValueHeaderRow<D> {
    type: 'value-header-row';
    dataColumns: DataColumnDescriptor<D, {}>[];
}

export interface BodyCell<D, T> {
    data: D[];
    value: T;
    column: DataColumnDescriptor<D, T>;
}

export interface BodyRow<D> {
    type: 'body-row';
    level: number;
    label: string;
    index: number;
    cells: BodyCell<D, {}>[];
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
    headGroupRows: GroupHeaderRow[];
    headValueRow: ValueHeaderRow<D>;
    columns: ValueColumnDescriptor<D>[];
    bodyRows: BodyRow<D>[];
}
