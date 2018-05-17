import * as React from 'react';
import { Filters } from '../filters/model';
import { applyFiltersToAll } from '../filters/apply-filter';
import { Formats } from '../formats/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { applyGroups, Grouping, CombinedGrouping, countUniqueLabels } from '../groups/apply-groups';
import { countLabels } from '../groups/count-labels';
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

export class Table<D> extends React.Component<TableProps<D>, never> {
    render() {
        const start = window.performance.now();
        const filteredData = applyFiltersToAll(this.props.filters, this.props.data);
        const groups = applyGroups(this.props.groups, filteredData);
        const selections = applyGroups(this.props.selections, filteredData);

        const uniqueGroupsEncoded = Array.from(new Set(groups.indices))
            .sort((a, b) => a - b);

        const uniqueGroups = uniqueGroupsEncoded
            .map((group) => {
                const indices: number[] = [];
                for (const factor of groups.factors) {
                    const index = Math.floor(group / factor);
                    indices.push(index);
                    group -= index * factor;
                }
                indices.push(group);
                return indices;
            });

        const groupUniqueLabelCount = countUniqueLabels(groups, uniqueGroups);

        const uniqueSelectionsEncoded = Array.from(new Set(selections.indices))
            .sort((a, b) => a - b);

        const uniqueSelections = uniqueSelectionsEncoded
            .map((selection) => {
                const indices: number[] = [];
                for (const factor of selections.factors) {
                    const index = Math.floor(selection / factor);
                    indices.push(index);
                    selection -= index * factor;
                }
                indices.push(selection);
                return indices;
            });

        return <React.Fragment>
            <table>
                <thead>
                    {this.props.groups.map((grouper, index) =>
                        <tr key={grouper.id}>
                            <th scope="row">{grouper.label}</th>
                            {groupUniqueLabelCount[index].map((labelCount, index) =>
                                <th key={index} scope="col" colSpan={labelCount.count}>
                                    {labelCount.label}
                                </th>
                            )}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {uniqueSelectionsEncoded.map((selectionEncoded, selectionIndex) =>
                        <tr key={selectionIndex}>
                            <th scope="row">{uniqueSelections[selectionIndex].map((label, labelIndex) => selections.labels[labelIndex][label]).join(' / ')}</th>
                            {uniqueGroupsEncoded.map((groupEncoded, groupIndex) =>
                                <td key={groupIndex}>
                                    {filteredData
                                        .filter((data, dataIndex) =>
                                            groups.indices[dataIndex] === groupEncoded
                                            && selections.indices[dataIndex] === selectionEncoded
                                        )
                                        .length
                                    }
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </React.Fragment>;
    }
}
