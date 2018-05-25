import * as React from 'react';
import { Filters } from '../filters/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { Selections } from '../selections/model';
import { applyGrouping, Grouping, RecursiveGroups } from '../groups/apply-grouping';
import { applyFilters } from '../filters/apply-filter';
import { Comparators } from '../sorting/model';
import { applySorting } from '../sorting/apply-sorting';
import { TableContainerProps } from './table-container';
import { TableHeadProps } from './table-head';
import { TableBodyProps } from './table-body';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Comparators<D>;
    values: ValueReducers<D>;
    tableContainerComponent: React.ComponentType<TableContainerProps>;
    tableHeadComponent: React.ComponentType<TableHeadProps>;
    tableBodyComponent: React.ComponentType<TableBodyProps>;
    tableRowComponent: React.ComponentType<TableRowProps>;
}

export type TableProvidedProps = 'tableContainerComponent' | 'tableHeadComponent' | 'tableBodyComponent';

export class Table<D> extends React.Component<TableProps<D>, never> {
    renderColumnValueHeading(recursiveColumns: RecursiveGroups, totalSubGroupCount: number) {
        const result: React.ReactNode[] = [];

        for (let i = 0; i < totalSubGroupCount; i++) {
            for (const valueDescription of this.props.values) {
                result.push(<th key={`${valueDescription.id}-${i}`} scope="col">{valueDescription.label}</th>);
            }
        }
        return <tr>
            <th scope="row">Values</th>
            {result}
        </tr>;
    }

    renderColumnGroupHeadingsRecursive(recursiveColumns: RecursiveGroups, level: number = 0): React.ReactNode {
        const childColumns = recursiveColumns.reduce<RecursiveGroups>((childColumns, column) => {
            if (column.childGroups) {
                return [...childColumns, ...column.childGroups];
            } else {
                return childColumns;
            }
        }, []);

        return <React.Fragment>
            <tr key={this.props.groups[level].id}>
                <th scope="row">{this.props.groups[level].label}</th>
                {recursiveColumns.map((column, index) =>
                    <th key={index} scope="column" colSpan={column.subGroupCount * this.props.values.length}>
                        {column.label}
                    </th>
                )}
            </tr>
            {childColumns.length >= 1 && this.renderColumnGroupHeadingsRecursive(childColumns, level + 1)}
        </React.Fragment>;
    }

    renderRowsRecursive(recursiveRows: RecursiveGroups, sortedIndices: number[], columns: Grouping, data: D[], level: number = 0): React.ReactNode {
        return recursiveRows
            .map((rows) => {
                const rowIndices: number[] = [];
                for (let i = rows.dataIndexStart; i < rows.dataIndexEnd; i++) {
                    rowIndices.push(sortedIndices[i]);
                }
                return { ...rows, rowIndices };
            })
            .sort((rows1, rows2) => {
                return applySorting(this.props.sorting, rows1.rowIndices.map((index) => data[index]), rows2.rowIndices.map((index) => data[index]));
            })
            .map((rows, index) => {
                const groupedData = columns.groupDataIndices(rows.rowIndices);
                return <React.Fragment key={index}>
                    <tr>
                        <th scope="row">{'>'.repeat(level)} {rows.label}</th>
                        {groupedData.map((indices, index) =>
                            this.props.values.map((valueDescription) =>
                                <td key={`${valueDescription.id}-${index}`}>{valueDescription.reducer(indices.map((index) => data[index]))}</td>
                            )
                        )}
                    </tr>
                    {rows.childGroups && this.renderRowsRecursive(rows.childGroups, sortedIndices, columns, data, level + 1)}
                </React.Fragment>;
            });
    }

    render() {
        const start = window.performance.now();
        const filteredData = applyFilters(this.props.filters, this.props.data);
        const columns = applyGrouping(this.props.groups, filteredData);
        const rows = applyGrouping(this.props.selections, filteredData);
        const totalSubGroupCount = columns.recursiveGroups.reduce((sum, column) => sum + column.subGroupCount, 0);

        console.log(`${window.performance.now() - start} ms`);
        console.log(rows);

        // TODO: decide what's better:
        // 1. customize all components for Table, render everything from here.
        // 2. move some rendering responsibility to other components such as thead, tbody, trow, pass higher level props to those.

        return <this.props.tableContainerComponent numGroupHeaderRows={this.props.groups.length} numDataColumns={totalSubGroupCount}>
            <this.props.tableHeadComponent numGroupHeaderRows={this.props.groups.length} numDataColumns={totalSubGroupCount}>
                {this.renderColumnGroupHeadingsRecursive(columns.recursiveGroups)}
                {this.renderColumnValueHeading(columns.recursiveGroups, totalSubGroupCount)}
            </this.props.tableHeadComponent>
            <this.props.tableBodyComponent numDataColumns={totalSubGroupCount}>
                {this.renderRowsRecursive(rows.recursiveGroups, rows.sortedIndices, columns, filteredData)}
            </this.props.tableBodyComponent>
        </this.props.tableContainerComponent>;
    }
}
