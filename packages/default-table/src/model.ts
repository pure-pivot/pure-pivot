import { ValueReducers, ValueReducerDescription } from '@pure-pivot/core/lib/es6/values/model';

export interface GroupDescriptor {
    groupId: string;
    groupIndex: number;
}

export interface HeadColumnDescriptor {
    type: 'head-column';
}

export interface GroupColumnDescriptor {
    type: 'group-column';
    label: string;
    subColumnSize: number;
    groupDescriptors: GroupDescriptor[];
}

export interface DataColumnDescriptor<D> {
    type: 'data-column';
    valueDescription: ValueReducerDescription<D>;
    groupDescriptors: GroupDescriptor[];
}

export type ColumnDescriptor<D> = DataColumnDescriptor<D> | HeadColumnDescriptor | GroupColumnDescriptor;

export interface GroupHeaderRow {
    type: 'group-header-row';
    level: number;
    groupId: string;
    groupLabel: string;
    groups: GroupColumnDescriptor[];
}

export interface ValueHeaderRow<D> {
    type: 'value-header-row';
    columns: DataColumnDescriptor<D>[];
}

// export type HeadRow<D> = GroupHeaderRow | ValueHeaderRow<D>; // | CustomHeaderRow<D>;

export interface BodyCell<D> {
    data: D[];
    column: DataColumnDescriptor<D>;
}

export interface BodyRow<D> {
    type: 'body-row';
    level: number;
    label: string;
    cells: BodyCell<D>[];
}

// export type Row<D> = BodyRow<D> | HeadRow<D>;

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
    bodyRows: BodyRow<D>[];
}
