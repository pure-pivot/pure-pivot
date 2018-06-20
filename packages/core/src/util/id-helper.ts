import { HeadColumnDescriptor, DataColumnDescriptor, GroupColumnDescriptor } from '../table/model';

export function getHeadValueRowCellId(column: HeadColumnDescriptor | DataColumnDescriptor<any, any>) {
    if (column.type === 'head-column') {
        return 'head-row-value-head-column';
    } else {
        return `head-row-value-${column.groupDescriptors.map((group) => `${group.groupId}-${group.groupIndex}`).join('-')}-${column.valueDescription.id}`;
    }
}

export function getHeadGroupRowCellId(groupId: string, column: HeadColumnDescriptor | GroupColumnDescriptor) {
    if (column.type === 'head-column') {
        return `head-row-${groupId}-head-column`;
    } else {
        return `head-row-${groupId}-${column.groupDescriptors.map((group) => `${group.groupId}-${group.groupIndex}`).join('-')}`;
    }
}

export function getBodyRowCellId(rowIndex: number, column: HeadColumnDescriptor | DataColumnDescriptor<any, any>) {
    if (column.type === 'head-column') {
        return `body-row-${rowIndex}-head-column`;
    } else {
        return `body-row-${rowIndex}-${column.groupDescriptors.map((group) => `${group.groupId}-${group.groupIndex}`).join('-')}-value-${column.valueDescription.id}`;
    }
}
