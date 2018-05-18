import * as React from 'react';
import { Filters } from '../filters/model';
import { applyFiltersToAll } from '../filters/apply-filter';
import { Formats } from '../formats/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { Grouping } from '../groups/grouping';
import { Selections } from '../selections/model';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    values: ValueReducers<D>;
    formats: Formats<D>;
}

export type TableProvidedProps = never;

const measure = {
    startTime: 0,
    start: () => {
        measure.startTime = window.performance.now();
    },
    log: () => {
        const end = window.performance.now();
        console.log(`${end - measure.startTime} ms`);
        measure.startTime = end;
    }
};

export interface Heading {
    label: string;
    count: number;
}

export interface LabeledGroupByLevel {
    id: string;
    label: string;
    headings: Heading[];
}

export class Table<D> extends React.Component<TableProps<D>, never> {
    renderRowHeadings(rows: LabeledGroupByLevel[], start: number = 0, count: number = Number.POSITIVE_INFINITY) {
        if (rows.length >= 1) {
            const [head, ...tail] = rows;
            const result: React.ReactNode[] = [];
            const end = Math.min(head.headings.length, start + count);
            let totalCount = 0;

            for (let i = start; i < end; i++) {
                result.push(
                    <React.Fragment key={i}>
                        <tr>
                            <th scope="row">{head.headings[i].label}</th>
                        </tr>
                        {this.renderRowHeadings(tail, totalCount, head.headings[i].count)}
                    </React.Fragment>
                );
                totalCount += head.headings[i].count;
            }

            return result;
        }
    }

    render() {
        measure.start();

        const filteredData = applyFiltersToAll(this.props.filters, this.props.data);
        measure.log();
        const groups = new Grouping(this.props.groups, filteredData);
        measure.log();
        const selections = new Grouping(this.props.selections, filteredData);
        measure.log();

        const uniqueGroupIndices = groups.getUniqueIndices();
        measure.log();
        const uniqueGroupLabelCount = groups.getUniqueIndexLabelCounts();
        measure.log();

        const uniqueSelectionIndices = selections.getUniqueIndices();
        measure.log();
        const uniqueSelectionsLabelCount = selections.getUniqueIndexLabelCounts();
        measure.log();

        const columns: LabeledGroupByLevel[] = this.props.groups.map((group, groupIndex) => ({
            id: group.id,
            label: group.label,
            headings: uniqueGroupLabelCount[groupIndex]
        }));

        const rows: LabeledGroupByLevel[] = this.props.selections.map((selection, selectionIndex) => ({
            id: selection.id,
            label: selection.label,
            headings: uniqueSelectionsLabelCount[selectionIndex]
        }));

        console.log(rows);

        return <React.Fragment>
            <table>
                <thead>
                    {columns.map((column) =>
                        <tr key={column.id}>
                            <th scope="row">{column.label}</th>
                            {column.headings.map((heading, index) =>
                                <th key={index} scope="col" colSpan={heading.count}>
                                    {heading.label}
                                </th>
                            )}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {this.renderRowHeadings(rows)}
                </tbody>
            </table>
        </React.Fragment>;
    }
}
