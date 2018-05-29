import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { Filters } from '../filters/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { Selections } from '../selections/model';
import { applyGrouping, Grouping, RecursiveGroup } from '../groups/apply-grouping';
import { applyFilters } from '../filters/apply-filter';
import { Comparators } from '../sorting/model';
import { applySorting } from '../sorting/apply-sorting';
import { TableContainerProps, TableContainerProvidedProps } from './table-container';
import { TableHeadProps, TableHeadProvidedProps } from './table-head';
import { TableBodyProps, TableBodyProvidedProps } from './table-body';
import { TableDescription, GroupHeaderRow, BodyRow, ValueHeaderRow, GroupDescriptor, ColumnDescriptor, DataColumnDescriptor, GroupColumnDescriptor } from './model';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Comparators<D>;
    values: ValueReducers<D>;
    tableContainerComponent: React.ComponentType<Pick<TableContainerProps<D>, Exclude<keyof TableContainerProps<D>, TableContainerProvidedProps>>>;
}

export type TableProvidedProps = 'tableContainerComponent' | 'customRows';

export class Table<D> extends React.Component<TableProps<D>, never> {
    shouldComponentUpdate(prevProps: TableProps<D>) {
        return !shallowEqual(this.props, prevProps);
    }

    createGroupHeaderRows(groupColumns: GroupColumnDescriptor[]): GroupHeaderRow[] {
        const rows: GroupHeaderRow[] = [];
        for (let i = 0; i < this.props.groups.length; i++) {
            rows.push({
                type: 'group-header-row',
                groupId: this.props.groups[i].id,
                groupLabel: this.props.groups[i].label,
                level: i,
                groups: []
            });
        }
        for (const column of groupColumns) {
            rows[column.groupDescriptors.length - 1].groups.push(column);
        }
        return rows;
    }

    createBodyRows(recursiveRows: RecursiveGroup[], sortedIndices: number[], columns: Grouping, data: D[], level: number = 0, accumulator: BodyRow<D>[] = []): BodyRow<D>[] {
        const rowsWithIndices = recursiveRows.map((rows) => {
            const rowIndices: number[] = [];
            for (let i = rows.dataIndexStart; i < rows.dataIndexEnd; i++) {
                rowIndices.push(sortedIndices[i]);
            }
            return { ...rows, rowIndices };
        }).sort((rows1, rows2) => {
            return applySorting(this.props.sorting, rows1.rowIndices.map((index) => data[index]), rows2.rowIndices.map((index) => data[index]));
        });

        for (const rows of rowsWithIndices) {
            const groupedData = columns.groupDataIndices(rows.rowIndices);

            accumulator.push({
                type: 'body-row',
                level,
                label: rows.label,
                data: groupedData.map((indices) => indices.map((index) => data[index]))
            });

            if (rows.childGroups) {
                this.createBodyRows(rows.childGroups, sortedIndices, columns, data, level + 1, accumulator);
            }
        }

        return accumulator;
    }

    createColumnDescriptors(recursiveColumns: RecursiveGroup[], groupDescriptors: GroupDescriptor[] = []): { dataColumns: DataColumnDescriptor[], groupColumns: GroupColumnDescriptor[] } {
        const dataColumns: DataColumnDescriptor[] = [];
        const groupColumns: GroupColumnDescriptor[] = [];

        for (const column of recursiveColumns) {
            const childGroupDescriptors = [
                ...groupDescriptors,
                {
                    groupId: column.groupId,
                    groupIndex: column.groupIndex
                }
            ];
            groupColumns.push({
                type: 'group-column',
                label: column.label,
                subColumnSize: column.subGroupCount,
                groupDescriptors: childGroupDescriptors
            });
            if (column.childGroups) {
                const childColumns = this.createColumnDescriptors(column.childGroups, childGroupDescriptors);
                for (const childDataColumn of childColumns.dataColumns) {
                    dataColumns.push(childDataColumn);
                }
                for (const childGroupColumn of childColumns.groupColumns) {
                    groupColumns.push(childGroupColumn);
                }
            } else {
                for (const valueDescription of this.props.values) {
                    dataColumns.push({
                        type: 'data-column',
                        groupDescriptors: childGroupDescriptors,
                        valueId: valueDescription.id,
                        label: valueDescription.label
                    });
                }
            }
        }

        return { dataColumns, groupColumns };
    }

    render() {
        const filteredData = applyFilters(this.props.filters, this.props.data);
        const columns = applyGrouping(this.props.groups, filteredData);
        const rows = applyGrouping(this.props.selections, filteredData);

        const columnDescriptors = this.createColumnDescriptors(columns.recursiveGroups);

        const valueHeaderRow: ValueHeaderRow = {
            type: 'value-header-row',
            columns: columnDescriptors.dataColumns
        };
        const groupHeaderRows = this.createGroupHeaderRows(columnDescriptors.groupColumns);
        const bodyRows = this.createBodyRows(rows.recursiveGroups, rows.sortedIndices, columns, filteredData);

        const tableDescription: TableDescription<D> = {
            headColumnCount: 1,
            bodyColumnCount: valueHeaderRow.columns.length,
            columnCount: valueHeaderRow.columns.length + 1,
            headRowCount: 1 + groupHeaderRows.length,
            bodyRowCount: bodyRows.length,
            rowCount: 1 + groupHeaderRows.length + bodyRows.length,
            valueCount: this.props.values.length,
            values: this.props.values,
            headRows: [
                ...groupHeaderRows,
                valueHeaderRow
            ],
            bodyRows
        };

        return <this.props.tableContainerComponent tableDescription={tableDescription} />;
    }
}
