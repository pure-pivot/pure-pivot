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
import { TableDescription, GroupHeaderRow, BodyRow, ValueHeaderRow, GroupDescriptor, ColumnDescriptor, DataColumnDescriptor, GroupColumnDescriptor, BodyCell } from './model';

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

    createColumnDescriptors(recursiveColumns: RecursiveGroup[], groupDescriptors: GroupDescriptor[] = []): { dataColumns: DataColumnDescriptor<D>[], groupColumns: GroupColumnDescriptor[] } {
        const dataColumns: DataColumnDescriptor<D>[] = [];
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
                        valueDescription
                    });
                }
            }
        }

        return { dataColumns, groupColumns };
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

    createValueHeaderRow(dataColumns: DataColumnDescriptor<D>[]): ValueHeaderRow<D> {
        return {
            type: 'value-header-row',
            columns: dataColumns
        };
    }

    createBodyRows(recursiveRows: RecursiveGroup[], sortedIndices: number[], columns: Grouping, dataColumns: DataColumnDescriptor<D>[], data: D[], level: number = 0, accumulator: BodyRow<D>[] = []): BodyRow<D>[] {
        const rowsWithData = recursiveRows.map((rows) => {
            const rowIndices: number[] = [];
            for (let i = rows.dataIndexStart; i < rows.dataIndexEnd; i++) {
                rowIndices.push(sortedIndices[i]);
            }
            return { ...rows, rowData: rowIndices.map((index) => data[index]) };
        });

        if (this.props.sorting.length >= 1) {
            rowsWithData.sort((rows1, rows2) => {
                return applySorting(this.props.sorting, rows1.rowData, rows2.rowData);
            });
        }

        for (const rows of rowsWithData) {
            const indicesByGroup = columns.groupDataIndices(rows.dataIndexStart, rows.dataIndexEnd);
            const cells: BodyCell<D>[] = [];

            for (let i = 0; i < indicesByGroup.length; i++) {
                const groupData = indicesByGroup[i].map((index) => data[index]);
                for (let j = 0; j < this.props.values.length; j++) {
                    cells.push({
                        data: groupData,
                        column: dataColumns[i * this.props.values.length + j]
                    });
                }
            }

            accumulator.push({
                type: 'body-row',
                level,
                label: rows.label,
                cells
            });

            if (rows.childGroups) {
                this.createBodyRows(rows.childGroups, sortedIndices, columns, dataColumns, data, level + 1, accumulator);
            }
        }

        return accumulator;
    }

    render() {
        console.log('Render table');

        const filteredData = applyFilters(this.props.filters, this.props.data);
        const columns = applyGrouping(this.props.groups, filteredData);
        const rows = applyGrouping(this.props.selections, filteredData);

        const columnDescriptors = this.createColumnDescriptors(columns.recursiveGroups);

        const valueHeaderRow: ValueHeaderRow<D> = this.createValueHeaderRow(columnDescriptors.dataColumns);
        const groupHeaderRows = this.createGroupHeaderRows(columnDescriptors.groupColumns);
        const bodyRows = this.createBodyRows(rows.recursiveGroups, rows.sortedIndices, columns, columnDescriptors.dataColumns, filteredData);

        const tableDescription: TableDescription<D> = {
            headColumnCount: 1,
            bodyColumnCount: valueHeaderRow.columns.length,
            columnCount: 1 + valueHeaderRow.columns.length,
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
