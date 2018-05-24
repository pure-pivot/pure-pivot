import * as React from 'react';
import { Filters } from '../filters/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { Selections } from '../selections/model';
import { applyGrouping, GroupLabels, Grouping } from '../groups/apply-grouping';
import { applyFilters } from '../filters/apply-filter';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    values: ValueReducers<D>;
}

export type TableProvidedProps = never;

export class Table<D> extends React.Component<TableProps<D>, never> {
    // renderRowData(columns: D[][]) {
    //     return columns.map((data, index) =>
    //         this.props.values.map((valueDescription) =>
    //             <td key={`${valueDescription.id}-${index}`}>{valueDescription.reducer(data)}</td>
    //         )
    //     );
    // }

    // renderRows(dataByRowAndColumn: D[][][], rowsLabelsByGroup: GroupLabels[], groupIndex: number = 0, count: number = Number.POSITIVE_INFINITY, runningIndices: number[] = rowsLabelsByGroup.map(() => 0)) {
    //     if (groupIndex < rowsLabelsByGroup.length) {
    //         const result: React.ReactNode[] = [];

    //         for (let i = runningIndices[groupIndex], totalCount = 0; i < rowsLabelsByGroup[groupIndex].headings.length && totalCount < count; i++ , runningIndices[groupIndex]++) {
    //             result.push(
    //                 <React.Fragment key={i}>
    //                     <tr>
    //                         <th scope="row">{'-'.repeat(groupIndex)} {rowsLabelsByGroup[groupIndex].headings[i].label}</th>
    //                         {groupIndex === rowsLabelsByGroup.length - 1 && this.renderRowData(dataByRowAndColumn[i])}
    //                     </tr>
    //                     {this.renderRows(dataByRowAndColumn, rowsLabelsByGroup, groupIndex + 1, rowsLabelsByGroup[groupIndex].headings[i].count, runningIndices)}
    //                 </React.Fragment>
    //             );
    //             totalCount += rowsLabelsByGroup[groupIndex].headings[i].count;
    //         }

    //         return result;
    //     }
    // }

    renderColumnHeadings(columns: Grouping) {
        let lastColumnIndices: number[] = [];

        return <React.Fragment>
            {this.props.groups.map((group, groupIndex) => {
                const columnIndices: number[] = lastColumnIndices = [];
                const counts: number[] = [];
                let lastEncodedIndex: number = 0;

                const factor = groupIndex >= columns.factors.length ? 1 : columns.factors[groupIndex];
                const previousFactor = groupIndex >= 1 ? columns.factors[groupIndex - 1] : Number.POSITIVE_INFINITY;

                for (let i = 0; i < columns.uniqueEncodedIndices.length; i++) {
                    if (i === 0 || columns.uniqueEncodedIndices[i] >= lastEncodedIndex + factor) {
                        lastEncodedIndex = Math.floor(columns.uniqueEncodedIndices[i] / factor) * factor;
                        columnIndices.push(lastEncodedIndex % previousFactor / factor);
                        counts.push(0);
                    }
                    counts[counts.length - 1] += 1;
                }

                return <tr key={group.id}>
                    <th scope="row">{group.label}</th>
                    {columnIndices.map((columnIndex, index) => {
                        return <th key={index} scope="column" colSpan={counts[index] * this.props.values.length}>
                            {columns.labels[groupIndex][columnIndex]}
                        </th>;
                    })}
                </tr>;
            })}
            <tr>
                <th scope="row">Values</th>
                {lastColumnIndices.map((_, index) =>
                    this.props.values.map((valueDescription) =>
                        <th key={`${valueDescription.id}-${index}`} scope="col">{valueDescription.label}</th>
                    )
                )}
            </tr>
        </React.Fragment>;
    }

    renderRowData(rows: Grouping, columns: Grouping, data: D[], start: number, end: number) {
        return columns.uniqueEncodedIndices.map((encodedIndex) => {
            const rowAndColumnData = columns.dataByEncodedIndex[encodedIndex]
                .filter((index) => start <= rows.encodedIndices[index] && rows.encodedIndices[index] < end)
                .map((index) => data[index]);

            return this.props.values.map((valueDescription) => {
                return <td key={`${valueDescription.id}-${encodedIndex}`}>
                    {valueDescription.reducer(rowAndColumnData)}
                </td>;
            });
        });
    }

    renderRows2(rows: Grouping, columns: Grouping, data: D[], groupIndex: number = 0): React.ReactNode {
        if (groupIndex < this.props.selections.length) {
            const factor = groupIndex >= rows.factors.length ? 1 : rows.factors[groupIndex];

            return rows.labels[groupIndex].map((label, labelIndex) => {
                return <tr key={labelIndex}>
                    <th scope="row">{'>'.repeat(groupIndex)} {label}</th>
                    {this.renderRowData(rows, columns, data, factor * labelIndex, factor * (labelIndex + 1))}
                    {this.renderRows2(rows, columns, data, groupIndex + 1)}
                </tr>;
            });
        }
    }

    render() {
        const start = window.performance.now();
        const filteredData = applyFilters(this.props.filters, this.props.data);
        const columns = applyGrouping(this.props.groups, filteredData);
        const rows = applyGrouping(this.props.selections, filteredData);

        // const indicesByRows = rows.groupDataIndices();
        // const dataByRowAndColumn = indicesByRows.map((indices) => columns.groupDataIndices(indices).map((indices) => indices.map((index) => filteredData[index])));

        console.log(`${window.performance.now() - start} ms`);

        return <React.Fragment>
            <table>
                <thead>
                    {this.renderColumnHeadings(columns)}
                </thead>
                <tbody>
                    {/* {this.renderRows(dataByRowAndColumn, rows.labelsByGroup)} */}
                    {this.renderRows2(rows, columns, filteredData)}
                </tbody>
            </table>
        </React.Fragment>;
    }
}
