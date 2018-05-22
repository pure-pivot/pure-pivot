import * as React from 'react';
import { Filters } from '../filters/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { Selections } from '../selections/model';
import { applyGrouping, GroupLabels } from '../groups/apply-grouping';
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
    renderRowData(columns: D[][]) {
        return columns.map((data, index) =>
            this.props.values.map((valueDescription) =>
                <td key={`${valueDescription.id}-${index}`}>{valueDescription.reducer(data)}</td>
            )
        );
    }

    renderRows(dataByRowAndColumn: D[][][], rowsLabelsByGroup: GroupLabels[], groupIndex: number = 0, count: number = Number.POSITIVE_INFINITY, runningIndices: number[] = rowsLabelsByGroup.map(() => 0)) {
        if (groupIndex < rowsLabelsByGroup.length) {
            const result: React.ReactNode[] = [];

            for (let i = runningIndices[groupIndex], totalCount = 0; i < rowsLabelsByGroup[groupIndex].headings.length && totalCount < count; i++ , runningIndices[groupIndex]++) {
                result.push(
                    <React.Fragment key={i}>
                        <tr>
                            <th scope="row">{'-'.repeat(groupIndex)} {rowsLabelsByGroup[groupIndex].headings[i].label}</th>
                            {groupIndex === rowsLabelsByGroup.length - 1 && this.renderRowData(dataByRowAndColumn[i])}
                        </tr>
                        {this.renderRows(dataByRowAndColumn, rowsLabelsByGroup, groupIndex + 1, rowsLabelsByGroup[groupIndex].headings[i].count, runningIndices)}
                    </React.Fragment>
                );
                totalCount += rowsLabelsByGroup[groupIndex].headings[i].count;
            }

            return result;
        }
    }

    renderColumnHeadings(columnsLabelsByGroup: GroupLabels[]) {
        if (columnsLabelsByGroup.length >= 1) {
            return <React.Fragment>
                {columnsLabelsByGroup.map((columnGroup) =>
                    <tr key={columnGroup.id}>
                        <th scope="row">{columnGroup.label}</th>
                        {columnGroup.headings.map((heading, index) =>
                            <th key={index} scope="col" colSpan={heading.count * this.props.values.length}>
                                {heading.label}
                            </th>
                        )}
                    </tr>
                )}
                <tr>
                    <th scope="row">Values</th>
                    {columnsLabelsByGroup[columnsLabelsByGroup.length - 1].headings.map((heading, index) =>
                        this.props.values.map((valueDescription) =>
                            <th key={`${valueDescription.id}-${index}`} scope="col">{valueDescription.label}</th>
                        )
                    )}
                </tr>
            </React.Fragment>;
        }
    }

    render() {
        const start = window.performance.now();
        const filteredData = applyFilters(this.props.filters, this.props.data);
        const columns = applyGrouping(this.props.groups, filteredData);
        const rows = applyGrouping(this.props.selections, filteredData);

        const indicesByRows = rows.groupDataIndices();
        const dataByRowAndColumn = indicesByRows.map((indices) => columns.groupDataIndices(indices).map((indices) => indices.map((index) => filteredData[index])));

        console.log(`${window.performance.now() - start} ms`);

        return <React.Fragment>
            <table>
                <thead>
                    {this.renderColumnHeadings(columns.labelsByGroup)}
                </thead>
                <tbody>
                    {this.renderRows(dataByRowAndColumn, rows.labelsByGroup)}
                </tbody>
            </table>
        </React.Fragment>;
    }
}
