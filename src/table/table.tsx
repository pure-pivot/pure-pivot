import * as React from 'react';
import { Filters } from '../filters/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { Selections } from '../selections/model';
import { applyGrouping, GroupLabels, Grouping, RecursiveGroups } from '../groups/apply-grouping';
import { applyFilters } from '../filters/apply-filter';
import { Comparators } from '../sorting/model';
import { applySorting } from '../sorting/apply-sorting';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Comparators<D>;
    values: ValueReducers<D>;
    hideColumnGroupHeading?: boolean;
    hideColumnValueHeading?: boolean;
}

export type TableProvidedProps = never;

export class Table<D> extends React.Component<TableProps<D>, never> {
    renderColumnValueHeading(recursiveColumns: RecursiveGroups) {
        if (!this.props.hideColumnValueHeading) {
            const totalSubGroupCount = recursiveColumns.reduce((sum, column) => sum + column.subGroupCount, 0);
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
    }

    renderColumnGroupHeadingsRecursive(recursiveColumns: RecursiveGroups, level: number = 0): React.ReactNode {
        if (!this.props.hideColumnGroupHeading) {
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

        const indicesByRows = rows.groupDataIndices();
        const dataByRowAndColumn = indicesByRows.map((indices) => columns.groupDataIndices(indices).map((indices) => indices.map((index) => filteredData[index])));

        console.log(`${window.performance.now() - start} ms`);

        console.log(rows.recursiveGroups);

        const moo = <table>
            <thead>
                {this.renderColumnGroupHeadingsRecursive(columns.recursiveGroups)}
                {this.renderColumnValueHeading(columns.recursiveGroups)}
            </thead>
            <tbody>
                {this.renderRowsRecursive(rows.recursiveGroups, rows.sortedIndices, columns, filteredData)}
            </tbody>
        </table>;

        console.log(`${window.performance.now() - start} ms`);

        return moo;
    }
}
