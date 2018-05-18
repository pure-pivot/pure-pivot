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

export class Table<D> extends React.Component<TableProps<D>, never> {
    // renderRowHeadings(labelsRecursive: GroupLabelsRecursive): React.ReactNode[] {
    //     return labelsRecursive.map((labels, labelsIndex) =>
    //         <React.Fragment key={labelsIndex}>
    //             <tr>
    //                 <th scope="row">{labels.label}</th>
    //             </tr>
    //             {this.renderRowHeadings(labels.nested)}
    //         </React.Fragment>
    //     );
    // }

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

        const columns = this.props.groups.map((group, groupIndex) => ({
            id: group.id,
            label: group.label,
            headings: uniqueGroupLabelCount[groupIndex].map((labelAndCount) => ({ label: labelAndCount.label, columnCount: labelAndCount.count }))
        }));

        const rows = this.props.selections.map((selection, selectionIndex) => ({
            id: selection.id,
            label: selection.label,
            headings: uniqueSelectionsLabelCount[selectionIndex].map((labelAndCount) => ({ label: labelAndCount.label, rowCount: labelAndCount.count }))
        }));

        return <React.Fragment>
            <table>
                <thead>
                    {columns.map((column) =>
                        <tr key={column.id}>
                            <th scope="row">{column.label}</th>
                            {column.headings.map((heading, index) =>
                                <th key={index} scope="col" colSpan={heading.columnCount}>
                                    {heading.label}
                                </th>
                            )}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {rows[rows.length - 1].headings.map((heading, index) =>
                        <tr key={index}>
                            <th scope="row">{heading.label}</th>
                        </tr>
                    )}
                </tbody>
            </table>
        </React.Fragment>;
    }
}
