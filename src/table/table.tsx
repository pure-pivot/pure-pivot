import * as React from 'react';
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
import { GroupHeaderRow } from './table-head-group-columns';
import { ValueHeaderRow } from './table-head-value-columns';
import { BodyRow } from './table-body-rows';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Comparators<D>;
    values: ValueReducers<D>;
    tableContainerComponent: React.ComponentType<Pick<TableContainerProps<D>, Exclude<keyof TableContainerProps<D>, TableContainerProvidedProps>>>;
}

export type TableProvidedProps = 'tableContainerComponent' | 'tableHeadComponent' | 'tableBodyComponent';

export class Table<D> extends React.Component<TableProps<D>, never> {
    createGroupHeaderRows(recursiveColumns: RecursiveGroup[], level: number = 0, accumulator: GroupHeaderRow[] = []): GroupHeaderRow[] {
        accumulator.push({
            type: 'group-header-row',
            level,
            label: this.props.groups[level].label,
            groups: recursiveColumns.map((column) => {
                return {
                    label: column.label,
                    subColumnSize: column.subGroupCount
                };
            })
        });

        const childColumns = recursiveColumns.reduce<RecursiveGroup[]>((childColumns, column) => {
            if (column.childGroups) {
                return [...childColumns, ...column.childGroups];
            } else {
                return childColumns;
            }
        }, []);

        if (childColumns.length >= 1) {
            this.createGroupHeaderRows(childColumns, level + 1, accumulator);
        }

        return accumulator;
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

    createValueHeaderRow(columns: Grouping): ValueHeaderRow {
        const totalSubGroupCount = columns.recursiveGroups.reduce((sum, column) => sum + column.subGroupCount, 0);

        const valueHeaderRow: ValueHeaderRow = {
            type: 'value-header-row',
            labels: []
        };

        for (let i = 0; i < totalSubGroupCount; i++) {
            for (const valueDescription of this.props.values) {
                valueHeaderRow.labels.push(valueDescription.label);
            }
        }

        return valueHeaderRow;
    }

    render() {
        const filteredData = applyFilters(this.props.filters, this.props.data);
        const columns = applyGrouping(this.props.groups, filteredData);
        const rows = applyGrouping(this.props.selections, filteredData);

        const valueHeaderRow = this.createValueHeaderRow(columns);
        const groupHeaderRows = this.createGroupHeaderRows(columns.recursiveGroups);
        const bodyRows = this.createBodyRows(rows.recursiveGroups, rows.sortedIndices, columns, filteredData);

        return <this.props.tableContainerComponent
            groupHeaderRows={groupHeaderRows}
            valueHeaderRow={valueHeaderRow}
            valueColumnCount={this.props.values.length}
            values={this.props.values}
            bodyRows={bodyRows}
        />;
    }
}
