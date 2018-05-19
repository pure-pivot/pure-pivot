import * as React from 'react';
import { Filters } from '../filters/model';
import { applyFiltersToAll } from '../filters/apply-filter';
import { Formats } from '../formats/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { Selections } from '../selections/model';
import { applyGrouping, GroupLabels } from '../groups/apply-grouping';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    values: ValueReducers<D>;
    formats: Formats<D>;
}

export type TableProvidedProps = never;

export class Table<D> extends React.Component<TableProps<D>, never> {
    renderRowData(columns: D[][]) {
        return columns.map((data, index) => {
            return <td key={index}>{data.length}</td>;
        });
    }

    renderRowHeadings(values: D[][][], rowsLabelsByGroup: GroupLabels[], groupIndex: number = 0, count: number = Number.POSITIVE_INFINITY, runningIndices: number[] = rowsLabelsByGroup.map(() => 0)) {
        if (groupIndex < rowsLabelsByGroup.length) {
            const result: React.ReactNode[] = [];

            for (let i = runningIndices[groupIndex], totalCount = 0; i < rowsLabelsByGroup[groupIndex].headings.length && totalCount < count; i++ , runningIndices[groupIndex]++) {
                result.push(
                    <React.Fragment key={i}>
                        <tr>
                            <th scope="row">{'-'.repeat(groupIndex + 1)} {rowsLabelsByGroup[groupIndex].headings[i].label}</th>
                            {groupIndex === rowsLabelsByGroup.length - 1 && this.renderRowData(values[i])}
                        </tr>
                        {this.renderRowHeadings(values, rowsLabelsByGroup, groupIndex + 1, rowsLabelsByGroup[groupIndex].headings[i].count, runningIndices)}
                    </React.Fragment>
                );
                totalCount += rowsLabelsByGroup[groupIndex].headings[i].count;
            }

            return result;
        }
    }

    render() {
        const filteredData = applyFiltersToAll(this.props.filters, this.props.data);
        const columns = applyGrouping(this.props.groups, filteredData);
        const rows = applyGrouping(this.props.selections, filteredData);

        const indicesByRows = rows.groupDataIndices();
        const values = indicesByRows.map((indices) => columns.groupDataIndices(indices).map((indices) => indices.map((index) => filteredData[index])));

        return <React.Fragment>
            <table>
                <thead>
                    {columns.labelsByGroup.map((columnGroup) =>
                        <tr key={columnGroup.id}>
                            <th scope="row">{columnGroup.label}</th>
                            {columnGroup.headings.map((heading, index) =>
                                <th key={index} scope="col" colSpan={heading.count}>
                                    {heading.label}
                                </th>
                            )}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {this.renderRowHeadings(values, rows.labelsByGroup)}
                </tbody>
            </table>
        </React.Fragment>;
    }
}
